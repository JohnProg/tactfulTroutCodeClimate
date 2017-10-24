import * as React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  StatusBar,
  AsyncStorage,
  Alert,
  ToastAndroid,
} from 'react-native'
import styled from 'styled-components/native'
import { ExpandingView } from 'react-native-jans-common-components'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import { gql, graphql, withApollo } from 'react-apollo'
import { NavigationActions } from 'react-navigation'
import { get } from 'lodash'

import { PRIMARY_COLOR, ASYNC_STORAGE_JWT_KEY } from '../../../constants'

const PADDING_HORIZONTAL = 50

const logInOrSignUpMutation = gql`
  mutation LogInOrSignUp(
    $mobile: PhoneNumber!
    $verificationCode: String!
    $wechatId: ID
  ) {
    logInOrSignUpAsPatient(
      mobile: $mobile
      verificationCode: $verificationCode
      wechatId: $wechatId
    ) {
      jwt
      didCreateNewPatient
    }
  }
`

const sendVerificationCodeMutation = gql`
  mutation SendMobileVerificationCode($mobile: PhoneNumber!) {
    sendMobileVerificationCode(mobile: $mobile)
  }
`

@withApollo
export class LogInOrSignUpScreen extends React.Component {
  state = {
    mobile: '',
    verificationCode: '',
    verificationCodeText: '获取验证码',
    verificationCodeButtonDisabled: false,
  }

  onBackPress = () => this.props.navigation.goBack()

  onSendVerificationCodePress = () => {
    const mobileText = this.state.mobile

    if (!mobileText || mobileText.length !== 11) {
      ToastAndroid.show('手机号输入有误 !', ToastAndroid.SHORT)
      return
    }
    this.props.client
      .mutate({
        mutation: sendVerificationCodeMutation,
        variables: { mobile: this.state.mobile },
      })
      .catch(() => null)

    let countDownTime = 60

    this.setState({
      verificationCodeButtonDisabled: true,
    })

    this.verificationCodeTextChange = setInterval(() => {
      countDownTime--
      if (countDownTime <= 0) {
        this.setState({
          verificationCodeText: '获取验证码',
          verificationCodeButtonDisabled: false,
        })
        clearInterval(this.verificationCodeTextChange)
      } else {
        this.setState({ verificationCodeText: countDownTime + '秒' })
      }
    }, 1000)
  }

  onLogInPress = async () => {
    try {
      const wechatId = get(this.props.navigation, 'state.params.wechatId', null)
      const wechatGender = get(
        this.props.navigation,
        'state.params.wechatGender',
        null,
      )
      const wechatAvatar = get(
        this.props.navigation,
        'state.params.wechatAvatar',
        null,
      )
      const variables = {
        mobile: this.state.mobile,
        verificationCode: this.state.verificationCode,
      }
      if (
        !variables.mobile ||
        // variables.mobile.length !== 11 ||
        !variables.verificationCode ||
        variables.verificationCode.length < 4
      ) {
        ToastAndroid.show('输入有误 !', ToastAndroid.SHORT)
        return
      }
      if (wechatId) {
        variables.wechatId = wechatId
      }
      const response = await this.props.client.mutate({
        mutation: logInOrSignUpMutation,
        variables,
      })
      const { jwt, didCreateNewPatient } = response.data.logInOrSignUpAsPatient

      await AsyncStorage.setItem(ASYNC_STORAGE_JWT_KEY, jwt)
      this.props.client.resetStore()
      this.props.navigation.goBack()
      this.props.navigation.navigate('MainStackNavigator')
      // this.props.navigation.navigate('InfoCompletionScreen', {
      //   wechatId,
      //   wechatGender,
      //   wechatAvatar,
      // })
      this.setState({ verificationCodeButtonDisabled: false })

      clearInterval(this.verificationCodeTextChange)
    } catch (e) {
      Alert.alert('Error', e.message)
    }
  }

  componentWillUnmount() {
    clearInterval(this.verificationCodeTextChange)
  }

  render() {
    return (
      <ExpandingView>
        <StatusBar hidden={false} />
        <View style={{ backgroundColor: PRIMARY_COLOR }}>
          <Navbar>
            <TouchableOpacity
              onPress={this.onBackPress}
              style={{
                paddingLeft: 15,
                paddingRight: 100,
                justifyContent: 'center',
              }}
            >
              <EntypoIcon
                style={{ backgroundColor: 'transparent', marginTop: 3 }}
                name="chevron-thin-left"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </Navbar>
          <View
            style={{
              alignItems: 'stretch',
              paddingHorizontal: PADDING_HORIZONTAL,
            }}
          >
            <TextInput
              style={{
                height: 40,
                borderBottomWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.75)',
                marginBottom: 20,
                color: 'white',
              }}
              placeholder="手机号"
              placeholderTextColor="rgba(255, 255, 255, 0.75)"
              underlineColorAndroid="transparent"
              selectionColor="white"
              keyboardType="numeric"
              value={this.state.mobile}
              onChangeText={mobile => this.setState({ mobile })}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.75)',
                marginBottom: 40,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  height: 40,
                  color: 'white',
                }}
                placeholder="输入验证码"
                placeholderTextColor="rgba(255, 255, 255, 0.75)"
                selectionColor="white"
                underlineColorAndroid="transparent"
                keyboardType="numeric"
                value={this.state.verificationCode}
                onChangeText={verificationCode =>
                  this.setState({ verificationCode })}
              />
              <TouchableOpacity
                disabled={this.state.verificationCodeButtonDisabled}
                onPress={this.onSendVerificationCodePress}
              >
                <Text
                  style={{
                    opacity: this.state.verificationCodeButtonDisabled
                      ? 0.5
                      : 1,
                    color: 'white',
                    fontSize: 17,
                  }}
                >
                  {this.state.verificationCodeText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: 'center', paddingTop: 40 }}>
          <LogInButton onPress={this.onLogInPress}>
            <LogInText>登录</LogInText>
          </LogInButton>
        </View>
      </ExpandingView>
    )
  }
}

const Navbar = styled.View`
  flex-direction: row;
  align-items: stretch;
  height: 44;
  margin-top: 20;
  marginBottom: 10;
`

const LogInButton = styled.TouchableOpacity`
  background-color: ${PRIMARY_COLOR};
  justify-content: center;
  align-items: center;
  border-radius: 3;
  width: ${Dimensions.get('window').width - PADDING_HORIZONTAL * 2};
  height: 40;
`

const LogInText = styled.Text`
  color: white;
  font-size: 17;
`
