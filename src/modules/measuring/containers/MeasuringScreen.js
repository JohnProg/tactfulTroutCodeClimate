import * as React from 'react'
import {
  Text,
  View,
  AsyncStorage,
  Button,
  ScrollView,
  Image,
  Animated,
  Modal,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Alert,
  ActivityIndicator,
  AppState,
} from 'react-native'
import { ExpandingView } from 'react-native-jans-common-components'
import { BluetoothStatus } from 'react-native-bluetooth-status-new'
import {
  iHealthDeviceManagerModule,
  BP3LModule,
} from '@ihealth/ihealthlibrary-react-native'
import { DeviceEventEmitter } from 'react-native'
import { Observable } from 'rxjs'
import Icon from 'react-native-vector-icons/Entypo'
import { gql, graphql } from 'react-apollo'
import { get, isEqual } from 'lodash'
import nibbana from 'nibbana'

import {
  ASYNC_STORAGE_JWT_KEY,
  ASYNC_STORAGE_SAVED_MAC_KEY,
  ASYNC_STORAGE_ENV_KEY,
  PRIMARY_COLOR,
} from '../../../constants'
const VERSION = require('../../../../package.json').version
import {
  TopHalf,
  BottomHalf,
  BigButton,
  DiscoveringModal,
  MeasuringModal,
  BigButtonText,
  BigButtonInLineBtn,
  InlineBtnText,
  FirstErrorButtonContent,
  SubsequentErrorsButtonContent,
  ConnectedButtonContent,
  MeasuringFailedButtonContent,
  BeforeMeasurePopupMenu,
} from '../components'
import { getLevelByStandard } from '../common'

const userIdQuery = gql`
  query UserIdQuery {
    me {
      _id
      ...on Patient {
        measurementDeviceAddress
      }
    }
  }
`

@graphql(userIdQuery)
export class MeasuringScreen extends React.Component {
  static navigationOptions = {
    title: '首页',
    header: null,
    tabBarIcon: ({ focused }) =>
      focused ? (
        <Image
          style={{ height: 32, width: 32 }}
          source={require('../../../../assets/imgs/tab-icon-home-2.png')}
        />
      ) : (
          <Image
            style={{ height: 32, width: 32 }}
            source={require('../../../../assets/imgs/tab-icon-home-1.png')}
          />
        ),
  }

  state = {
    // state: 'DISCOVERING',
    state: 'PRE_INITIAL',
    errorCount: 0,
    discoveredMacs: [],
    batteryLevel: null,
    popupDiscoverModal: false,
    isBeforeMeasureMenuShow: false,
    isTokenMedicine: false,
    macAddress: '',
  }

  logState = () =>
    console.log(
      '%cState: ' + this.state.state,
      'color: green; font-weight: bold; font-size: 25px;',
    )

  async componentDidMount() {
    this.logState()
    this.addListeners()
    AppState.addEventListener('change', this.changeState)
  }
  async componentWillReceiveProps(newProps) {
    if (!isEqual(newProps.data, this.props.data) && !newProps.data.loading) {
      const measurementDeviceAddress = get(newProps, 'data.me.measurementDeviceAddress') || ''
      const localMeasurementDeviceAddress = await AsyncStorage.getItem(ASYNC_STORAGE_SAVED_MAC_KEY)
      if(measurementDeviceAddress !== localMeasurementDeviceAddress) {
        this.setState({macAddress: measurementDeviceAddress})
        await AsyncStorage.setItem(ASYNC_STORAGE_SAVED_MAC_KEY, measurementDeviceAddress)
      }
    }
  }
  componentWillUpdate(newProps, newState) {
    if (this.state.state !== newState.state) {
      console.log(
        '%cState: ' + newState.state,
        'color: green; font-weight: bold; font-size: 25px;',
      )
    }

    const userId = get(newProps, 'data.me._id', null)
    if (userId) {
      nibbana.identify(userId)
    }
  }

  componentWillUnmount() {
    this.removeListeners()
    AppState.removeEventListener('change', this.changeState)
  }

  changeState = async state => {
    const pairedBP3LMac = await AsyncStorage.getItem(ASYNC_STORAGE_SAVED_MAC_KEY)
    if (pairedBP3LMac) {
      if (state === 'background') {
        BP3LModule.disconnect(pairedBP3LMac)
      } else if (state === 'active') {
        this.connect(pairedBP3LMac)
      }
    }else {
      this.setState({
        state: 'INITIAL'
      })
    }
  }

  startBP3LStateMachine = async () => {
    navigator.geolocation.getCurrentPosition(
      position => nibbana.registerSuperProperties({ position }),
      () => {},
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    )
    const savedMac = await AsyncStorage.getItem(ASYNC_STORAGE_SAVED_MAC_KEY)
    if (savedMac) {
      this.connect(savedMac)
    } else {
      this.discover()
      this.discoverTimeOut = setTimeout(async () => {
        this.setState({
          state: 'DISCOVERING_FAILED',
          errorCount: this.state.errorCount + 1,
        })
        await AsyncStorage.setItem(ASYNC_STORAGE_SAVED_MAC_KEY, '')
      }, 12*1000)
    }
  }

  addListeners() {
    this.discoverListener = DeviceEventEmitter.addListener(
      iHealthDeviceManagerModule.Event_Scan_Device,
      e => this.foundDeviceEventReceived(e.mac),
    )
    this.connectionSucceededListener = DeviceEventEmitter.addListener(
      iHealthDeviceManagerModule.Event_Device_Connected,
      e => this.connectedEventReceived(e.mac),
    )
    this.connectionFailedListener = DeviceEventEmitter.addListener(
      iHealthDeviceManagerModule.Event_Device_Connect_Failed,
      e => this.connectionFailedEventReceived(e.mac),
    )
    this.notifyEventListener = DeviceEventEmitter.addListener(
      BP3LModule.Event_Notify,
      this.notifyEventReceived,
    )
  }

  removeListeners() {
    this.discoverListener && this.discoverListener.remove()
    this.connectionSucceededListener &&
      this.connectionSucceededListener.remove()
    this.connectionFailedListener && this.connectionFailedListener.remove()
    this.notifyEventListener && this.notifyEventListener.remove()
  }

  foundDeviceEventReceived = async mac => {
    const { popupDiscoverModal, state,  discoveredMacs} = this.state
    if (!popupDiscoverModal && state !== 'CONNECTING') {
      iHealthDeviceManagerModule.stopDiscovery()
      this.discoverTimeOut && clearTimeout(this.discoverTimeOut)
      this.connect(mac)
    } else {
      this.setState({ discoveredMacs: [...this.state.discoveredMacs, mac] })
    }
  }

  notifyEventReceived = async event => {
    // console.log(event)

    switch (event.action) {
      case 'battery_bp':
        this.setState({ batteryLevel: event.battery })
        break
      case 'error_bp':
        if (this.state.state === 'MEASURING') {
          this.setState({ state: 'MEASURING_FAILED' })
        }
        break
      case 'stop':
      case 'interrupted_bp':
        this.setState({ state: 'CONNECTED' })
        break
      case 'online_result_bp': {
        this.setState({ state: 'CONNECTED' })

        nibbana.logEvent('Successful measurement')

        const { sys: systolic, dia: diastolic, heartRate: pulse } = event
        const level = getLevelByStandard(systolic, diastolic)
        this.props.navigation.navigate('MeasuringResultScreen', {
          systolic,
          diastolic,
          pulse,
          level,
          isTokenMedicine: this.state.isTokenMedicine,
        })
      }
    }
  }

  connectedEventReceived = async mac => {
    this.stopGuardProcess()
    switch (this.state.state) {
      case 'CONNECTING': {
        await AsyncStorage.setItem(ASYNC_STORAGE_SAVED_MAC_KEY, mac)
        BP3LModule.getBattery(mac)
        this.setState({ state: 'CONNECTED' })
      }
      case 'CONNECTED':
        break
      default:
        break
    }
  }

  connectionFailedEventReceived = async mac => {
    this.setState({
      errorCount: this.state.errorCount + 1,
      state: 'CONNECTION_FAILED',
    })
    await AsyncStorage.setItem(ASYNC_STORAGE_SAVED_MAC_KEY, '')
    this.stopGuardProcess()
  }

  connect = async mac => {
    this.setState({ batteryLevel: null })
    if (!mac) {
      throw new Error('mac is falsy')
    }
    this.setState({ state: 'CONNECTING', macAddress: mac }, async () => {
      iHealthDeviceManagerModule.connectDevice(mac, 'BP3L')
      this.startGuardProcess('CONNECTION_FAILED', 15)
    })
  }

  startGuardProcess = (state, timeOut = 12) => {
    console.log('~~~startGuardProcess')
    this.setTimeoutValue = setTimeout(async () => {
      this.setState({
        state,
        errorCount: this.state.errorCount + 1,
      })
      await AsyncStorage.setItem(ASYNC_STORAGE_SAVED_MAC_KEY, '')
    }, timeOut*1000)
  }

  stopGuardProcess = () => {
    console.log('!!!stopGuardProcess')
    this.setTimeoutValue && clearTimeout(this.setTimeoutValue)
  }

  discover = async (popupDiscoverModal = false) => {
    const isbluetoothOpened = await this.checkBluetooth()
    if(!isbluetoothOpened) return
    const { state } = this.state
    const setObj = {
      discoveredMacs: [],
      popupDiscoverModal,
    }
    if (!/CONNECTED|MEASURING_FAILED/g.test(state)) {
      setObj.state = 'DISCOVERING'
    }
    this.setState(setObj, async () => {
      iHealthDeviceManagerModule.stopDiscovery()
      iHealthDeviceManagerModule.startDiscovery(iHealthDeviceManagerModule.BP3L)
    })
  }

  cancelDiscover = async () => {
    const setObj = {
      popupDiscoverModal: false,
    }
    if (!/CONNECTED|MEASURING_FAILED/g.test(this.state.state)) {
      setObj.state = 'INITIAL'
    }
    this.setState(setObj, () => {
      iHealthDeviceManagerModule.stopDiscovery()
    })
  }

  measure = async () => {
    const mac = await AsyncStorage.getItem(ASYNC_STORAGE_SAVED_MAC_KEY)

    if (mac) {
      this.setState({ state: 'MEASURING' }, () => {
        BP3LModule.startMeasure(mac)
      })
    }
  }

  stopMeasurement = async () => {
    const mac = await AsyncStorage.getItem(ASYNC_STORAGE_SAVED_MAC_KEY)

    if (mac) {
      BP3LModule.stopMeasure(mac)
      this.setState({ state: 'CONNECTED' })
    }
  }

  checkBluetooth = async () => {
    const isBluetoothEnabled = await BluetoothStatus.state()
    if(!isBluetoothEnabled) {
      if (Platform.OS === 'ios') {
        BluetoothStatus.openBluetoothSettings()
      } else if(Platform.OS === 'android') {
        await BluetoothStatus.enable()
      }
      return false
    }
    return true
  }

  onBigButtonPress = async () => {
    const isbluetoothOpened = await this.checkBluetooth()
    if(!isbluetoothOpened) return
    switch (this.state.state) {
      case 'PRE_INITIAL':
        this.setState({ isBeforeMeasureMenuShow: true })
        break
      case 'INITIAL':
      case 'DISCOVERING_FAILED':
      case 'CONNECTION_FAILED':
        this.startBP3LStateMachine()
        break
      case 'CONNECTING':
        break
      case 'MEASURING_FAILED':
      case 'CONNECTED': {
        this.measure()
        break
      }
    }
  }

  renderBigButtonContent = () => {
    switch (this.state.state) {
      case 'PRE_INITIAL':
        return (
          <BigButtonInLineBtn
            onPress={() => {
              this.setState({ isBeforeMeasureMenuShow: true })
            }}
          >
            <InlineBtnText>现在测量</InlineBtnText>
          </BigButtonInLineBtn>
        )
      case 'INITIAL':
        return <BigButtonText>现在测量</BigButtonText>
      case 'DISCOVERING':
        return <BigButtonText>正在搜索</BigButtonText>
      case 'CONNECTING':
        return <View>
          <BigButtonText>正在连接血压计</BigButtonText>
          <BigButtonText>{this.state.macAddress.substr(-4)}</BigButtonText>
        </View>
      case 'DISCOVERING_FAILED':
      case 'CONNECTION_FAILED':
        if (this.state.errorCount === 1) {
          return <FirstErrorButtonContent />
        } else {
          return <SubsequentErrorsButtonContent />
        }
      case 'CONNECTED':
        return <ConnectedButtonContent />
      case 'MEASURING_FAILED':
        return <MeasuringFailedButtonContent />
      default:
        return (
          <ActivityIndicator color={PRIMARY_COLOR} animating size="large" />
        )
    }
  }

  onMenuLeftPressed = async () => {
    this.setState({
      state: 'INITIAL',
      isBeforeMeasureMenuShow: false,
      isTokenMedicine: false,
    })
  }

  onMenuRightPressed = async () => {
    this.setState({
      state: 'INITIAL',
      isBeforeMeasureMenuShow: false,
      isTokenMedicine: true,
    })
  }

  render() {
    const topSectionFlex = 1.2
    const heightOfTopSection =
      (Dimensions.get('window').height -
        56 -
        (Platform.OS === 'ios' ? 0 : 20)) *
      topSectionFlex /
      (topSectionFlex + 1)

    return (
      <ExpandingView>
        <TopHalf
          flex={topSectionFlex}
          status={this.state.state}
          onHistoryPress={() => {
            this.props.navigation.navigate('MeasureTrendScreen')
          }}
        />
        {this.state.state !== 'PRE_INITIAL' && (
          <BottomHalf
            discover={this.discover}
            batteryLevel={this.state.batteryLevel}
            status={this.state.state}
          />
        )}
        <BigButton
          onPress={this.onBigButtonPress}
          status={this.state.state}
          distanceFromParentTopToButtonCenter={heightOfTopSection}
        >
          {this.renderBigButtonContent()}
        </BigButton>
        <DiscoveringModal
          visible={
            this.state.popupDiscoverModal
          }
          discoveredMacs={this.state.discoveredMacs}
          cancelDiscover={this.cancelDiscover}
          connect={mac => this.connect(mac)}
        />
        <MeasuringModal
          visible={this.state.state === 'MEASURING'}
          heightOfTopSection={heightOfTopSection}
          cancelMeasurement={this.stopMeasurement}
        />
        {this.state.isBeforeMeasureMenuShow && (
          <BeforeMeasurePopupMenu
            onMenuLeftPressed={this.onMenuLeftPressed}
            onMenuRightPressed={this.onMenuRightPressed}
          />
        )}
      </ExpandingView>
    )
  }
}
