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
import { BluetoothStatus } from 'react-native-bluetooth-status'
import {
  iHealthDeviceManagerModule,
  BP3LModule,
} from '@ihealth/ihealthlibrary-react-native'
import { DeviceEventEmitter } from 'react-native'
import { Observable } from 'rxjs'
import Icon from 'react-native-vector-icons/Entypo'
import { gql, graphql } from 'react-apollo'
import { get } from 'lodash'
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
    // state: 'INITIAL',
    state: 'PRE_INITIAL',
    errorCount: 0,
    discoveredMacs: [],
    batteryLevel: null,
    isBeforeMeasureMenuShow: false,
    isTokenMedicine: false,
  }

  logState = () =>
    console.log(
      '%cState: ' + this.state.state,
      'color: green; font-weight: bold; font-size: 25px;',
    )

  async componentDidMount() {
    this.logState()
    this.addListeners()
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
  }

  startBP3LStateMachine = async () => {
    const savedMac = await AsyncStorage.getItem(ASYNC_STORAGE_SAVED_MAC_KEY)
    if (savedMac) {
      this.connect(savedMac)
    } else {
      this.discover()
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

  foundDeviceEventReceived = mac => {
    switch (this.state.state) {
      case 'DISCOVERING':
        this.setState({ discoveredMacs: [...this.state.discoveredMacs, mac] })
        break

      default:
        break
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

        nibbana.trackEvent('Successful measurement')

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

  connectionFailedEventReceived = async mac =>
    this.setState({
      errorCount: this.state.errorCount + 1,
      state: 'CONNECTION_FAILED',
    })

  connect = async mac => {
    this.setState({ batteryLevel: null })

    if (!mac) {
      throw new Error('mac is falsy')
    }
    this.setState({ state: 'CONNECTING' }, async () => {
      iHealthDeviceManagerModule.connectDevice(mac, 'BP3L')
      await AsyncStorage.setItem(ASYNC_STORAGE_SAVED_MAC_KEY, mac)

      BP3LModule.getBattery(mac)
    })
  }

  discover = () =>
    this.setState({ state: 'DISCOVERING', discoveredMacs: [] }, async () => {
      iHealthDeviceManagerModule.stopDiscovery()
      iHealthDeviceManagerModule.startDiscovery(iHealthDeviceManagerModule.BP3L)
    })

  cancelDiscover = async () =>
    this.setState({ state: 'INITIAL' }, () => {
      iHealthDeviceManagerModule.stopDiscovery()
    })

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

  onBigButtonPress = async () => {
    if (Platform.OS === 'ios') {
      const isBluetoothEnabled = await BluetoothStatus.state()
      if (!isBluetoothEnabled) {
        BluetoothStatus.openBluetoothSettings()
        return
      }
    }
    switch (this.state.state) {
      case 'PRE_INITIAL':
        this.setState({ isBeforeMeasureMenuShow: true })
        break
      case 'INITIAL':
        // this.setState({ state: 'PRE_INITIAL' })
        this.startBP3LStateMachine()
        break
      case 'CONNECTION_FAILED': {
        const mac = await AsyncStorage.getItem(ASYNC_STORAGE_SAVED_MAC_KEY)

        if (mac) {
          this.connect(mac)
        } else {
          this.setState({ state: 'INITIAL' })
        }
        break
      }
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
            onPress={
              () => {
                this.setState({ isBeforeMeasureMenuShow: true })
              }
            }
          >
            <InlineBtnText>现在测量</InlineBtnText>
          </BigButtonInLineBtn>
        )
      case 'INITIAL':
        return <BigButtonText>现在测量</BigButtonText>
      case 'DISCOVERING':
        return <BigButtonText>正在搜索</BigButtonText>
      case 'CONNECTING':
        return <BigButtonText>正在连接血压计</BigButtonText>
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
            this.props.navigation.navigate('MeasurementHistoryScreen')
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
          visible={this.state.state === 'DISCOVERING'}
          discoveredMacs={this.state.discoveredMacs}
          cancelDiscover={this.cancelDiscover}
          connect={mac => this.connect(mac)}
        />
        <MeasuringModal
          visible={this.state.state === 'MEASURING'}
          heightOfTopSection={heightOfTopSection}
          cancelMeasurement={this.stopMeasurement}
        />
        {
        this.state.isBeforeMeasureMenuShow &&
        <BeforeMeasurePopupMenu
          onMenuLeftPressed={this.onMenuLeftPressed}
          onMenuRightPressed={this.onMenuRightPressed}
        />
        }
      </ExpandingView>
    )
  }
}
