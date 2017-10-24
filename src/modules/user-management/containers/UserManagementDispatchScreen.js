import * as React from 'react'
import * as wechat from 'react-native-wechat'
import { gql, graphql, withApollo } from 'react-apollo'
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Alert,
  AsyncStorage,
} from 'react-native'
import { ExpandingView } from 'react-native-jans-common-components'
import Icon from 'react-native-vector-icons/FontAwesome'

import {
  ASYNC_STORAGE_ENV_KEY,
  PRIMARY_COLOR,
  ASYNC_STORAGE_JWT_KEY,
} from '../../../constants'

const wechatLoginQuery = gql`
  query WechatRegisterorLoginForPatient(
    $wechatCode: String!
    $isFromRN: Boolean
  ) {
    wechatRegisterorLoginForPatient(
      wechatCode: $wechatCode
      isFromRN: $isFromRN
    ) {
      jwt
      status
      wechatId
      wechatGender
      wechatAvatar
    }
  }
`

@withApollo
export class UserManagementDispatchScreen extends React.Component {
  state = {
    isWXAppInstalled: false,
  }
  componentWillMount() {
    wechat
      .isWXAppInstalled()
      .then(installed => this.setState({ isWXAppInstalled: installed }))
  }
  onLogInOrSignUpPress = () => {
    this.props.navigation.navigate('LogInOrSignUpScreen')
  }

  onToSPress = () => this.props.navigation.navigate('TermsOfServiceScreen')

  onWechatLoginPress = async () => {
    const scope = 'snsapi_userinfo'
    const state = 'wechat_sdk_demo'
    try {
      if (!this.state.isWXAppInstalled) {
        console.log('没有安装微信，请您安装微信之后再试')
        return
      }

      const wxResp = await wechat.sendAuthRequest(scope, state)
      if (wxResp.errCode !== 0) {
        return
      }

      const response = await this.props.client.query({
        query: wechatLoginQuery,
        variables: {
          wechatCode: wxResp.code,
          isFromRN: true,
        },
      })
      const {
        jwt,
        status,
        wechatId,
        wechatGender,
        wechatAvatar,
      } = response.data.wechatRegisterorLoginForPatient
      if (!jwt) {
        this.props.navigation.navigate('LogInOrSignUpScreen', {
          wechatId,
          wechatGender,
          wechatAvatar,
        })
      } else {
        await AsyncStorage.setItem(ASYNC_STORAGE_JWT_KEY, jwt)
        this.props.client.resetStore()
        this.props.navigation.goBack()
        this.props.navigation.navigate('MainStackNavigator')
      }
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    return (
      <ExpandingView>
        {/*<StatusBar hidden />*/}
        <View
          style={{
            paddingTop: 40,
            backgroundColor: PRIMARY_COLOR,
            flex: 2,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onLongPress={async () => {
              const currentEnv = await AsyncStorage.getItem(
                ASYNC_STORAGE_ENV_KEY,
              )
              if (currentEnv === 'STAGING') {
                AsyncStorage.setItem(ASYNC_STORAGE_ENV_KEY, 'LOCAL')
                Alert.alert('Env', 'Changed to LOCAL, please restart app')
              } else if (currentEnv === 'LOCAL') {
                AsyncStorage.setItem(ASYNC_STORAGE_ENV_KEY, 'PRODUCTION')
                Alert.alert('Env', 'Changed to PRODUCTION, please restart app')
              } else {
                AsyncStorage.setItem(ASYNC_STORAGE_ENV_KEY, 'STAGING')
                Alert.alert('Env', 'Changed to STAGING, please restart app')
              }
            }}
          >
            <Image
              resizeMode="contain"
              style={{ width: 100, height: 100 * 142 / 162 }}
              source={require('../../../../assets/imgs/logo.png')}
            />
          </TouchableOpacity>
          <Text
            style={{
              lineHeight: 30,
              fontSize: 22,
              fontWeight: '400',
              color: 'white',
            }}
          >
            控{'\n'}血{'\n'}压
          </Text>
          <Image
            style={{ width: 50, height: 50 * 1.47 }}
            source={require('../../../../assets/imgs/login-bg-chart.png')}
          />
          <Image
            style={{ width: Dimensions.get('window').width, height: 90 }}
            source={require('../../../../assets/imgs/login-bg-wave.png')}
          />
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <View style={{ alignItems: 'center' }}>
            {this.state.isWXAppInstalled && (
              <TouchableOpacity onPress={this.onWechatLoginPress}>
                <View
                  style={{
                    backgroundColor: PRIMARY_COLOR,
                    height: 40,
                    width: 240,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 3,
                    marginBottom: 20,
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 18 }}>微信登录</Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={this.onLogInOrSignUpPress}>
              <Text style={{ color: PRIMARY_COLOR, fontSize: 18 }}>手机号登录</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={this.onToSPress}
          >
            <Icon
              name="check-circle"
              size={13}
              color="#00DD00"
              style={{ marginRight: 5 }}
            />
            <Text style={{ color: '#999', fontSize: 13 }}>我同意《控血压服务协议》</Text>
          </TouchableOpacity>
        </View>
      </ExpandingView>
    )
  }
}
