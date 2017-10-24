import * as React from 'react'
import { connect } from 'react-redux'
import {
  Text,
  AsyncStorage,
  Button,
  ScrollView,
  NetInfo,
  Image,
  ActivityIndicator,
  Platform,
  NativeModules,
  BackHandler,
  Linking,
} from 'react-native'
import { ExpandingCenteringView } from 'react-native-jans-common-components'
import styled from 'styled-components'
import nibbana from 'nibbana'

import {
  PRIMARY_COLOR,
  ASYNC_STORAGE_JWT_KEY,
  ASYNC_STORAGE_ENV_KEY,
  API_APP_UPGRADE,
} from '../../constants'
import { AlertDialog } from '../upgrade'
import { gql, graphql } from 'react-apollo'
const APP_VERSION = require('../../../package.json').version

// app=test&user=testuser&current=1.0.0
let reqBody = ''
let responeaData
let isScreenDismiss = false
let newVersionUrl
let dialogContent = '是否下载新版本App ?'
const downingText = '1. 正在升级\n2.升级过程大概需要15秒\n3.通知栏可以查看进度'

class InitialScreenComponent extends React.Component {
  constructor(props) {
    console.log('InitialScreenComponent')
    super(props)
    isScreenDismiss = false
    this.state = {
      showSpinner: false,
      isDialogVisible: false,
    }
  }

  handleCheckUpdate() {
    reqBody =
      Platform.OS === 'ios'
        ? 'app=com.ihealthlabs.KongXueYa'
        : 'app=com.ihealth.KongXueYa'
    reqBody += '&current=' + APP_VERSION
    console.log(reqBody)

    this.checkAppNewVersion()
    setTimeout(() => {
      console.log('navigateAway')
      if (!this.state.isDialogVisible) {
        this.navigateAway()
      }
    }, 3000)
  }

  async componentDidMount() {
    console.log('componentDidMount')
    this.handleCheckUpdate()
    // await autoUpdateWithTimeout(3000, 5000, () => this.setState({ showSpinner: true }))

    const env = await AsyncStorage.getItem(ASYNC_STORAGE_ENV_KEY)
    if (env === 'STAGING') {
      nibbana.initialize(
        'https://dodgy-dove-stg.ihealthlabs.com.cn/nibbana',
        'Pv8xkwnuhB',
      )
    } else if (env === 'LOCAL') {
      nibbana.initialize('http://localhost:3081/nibbana', 'nibnibToken')
    } else {
      nibbana.initialize(
        'https://dodgy-dove.301-prod.ihealthcn.com/nibbana',
        'VVytmT2VZZ',
      )
    }
  }

  checkAppNewVersion() {
    console.log('checkAppNewVersion begin')
    fetch(API_APP_UPGRADE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: reqBody,
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log(data)
        if (data.data && data.data.upgrade && !isScreenDismiss) {
          responeaData = data.data
          dialogContent = responeaData.content
          newVersionUrl = data.data.target_link
          this.showDialog()
        }
      })
      .catch(e => {
        console.log('error', e)
      })
  }

  navigateAway = async () => {
    isScreenDismiss = true
    // Navigate away
    const jwt = await AsyncStorage.getItem(ASYNC_STORAGE_JWT_KEY)
    if (jwt) {
      this.props.navigation.navigate('MainStackNavigator')
    } else {
      this.props.navigation.navigate('UserManagementStackNavigator')
    }
  }

  showDialog() {
    this.setState({ isDialogVisible: true })
  }

  hideDialog() {
    this.setState({ isDialogVisible: false })
  }

  onRightPressed() {
    this.hideDialog()

    if (Platform.OS === 'ios') {
      Linking.openURL(
        'https://itunes.apple.com/us/app/%E6%8E%A7%E8%A1%80%E5%8E%8B/id1279148650?l=zh&ls=1&mt=8',
      )
    } else {
      // this.navigateAway()

      if (newVersionUrl) {
        NativeModules.upgrade.upgrade(newVersionUrl)
      }
      if (responeaData.required_version === 1) {
        //强制升级 留在当前页面
        dialogContent = downingText
        this.showDialog()
      } else {
        this.navigateAway()
      }
    }
  }

  onLeftPressed() {
    this.hideDialog()
    if (responeaData.required_version === 1) {
      //强制升级 关闭app
      BackHandler.exitApp()
    } else {
      this.navigateAway()
    }
  }

  render() {
    return (
      <ExpandingCenteringView style={{ backgroundColor: 'white' }}>
        <Image
          style={{ flex: 1 }}
          resizeMode="contain"
          source={require('../../../assets/imgs/splash.png')}
        />
        {this.state.showSpinner && (
          <ActivityIndicator color="white" size="large" animating />
        )}
        <AlertDialog
          dialogTitle={responeaData ? responeaData.title : '提示'}
          dialogContent={dialogContent}
          dialogVisible={this.state.isDialogVisible}
          dialogLeftBtnAction={() => {
            if (downingText === dialogContent) {
              return
            }
            this.onLeftPressed()
          }}
          dialogRightBtnAction={() => {
            if (downingText === dialogContent) {
              return
            }
            this.onRightPressed()
          }}
        />
      </ExpandingCenteringView>
    )
  }
}
export const InitialScreen = InitialScreenComponent
