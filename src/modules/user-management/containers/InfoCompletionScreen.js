import * as React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Dimensions,
  StatusBar,
  AsyncStorage,
  Alert,
  Image,
} from 'react-native'
import DatePicker from 'react-native-datepicker'
import styled from 'styled-components/native'
import { ExpandingView } from 'react-native-jans-common-components'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import { gql, graphql, withApollo } from 'react-apollo'
import { NavigationActions } from 'react-navigation'
import { get } from 'lodash'

import { PRIMARY_COLOR, ASYNC_STORAGE_JWT_KEY } from '../../../constants'

var ImagePicker = require('react-native-image-picker')

const PADDING_HORIZONTAL = 50

const updateAvatar = gql`
  mutation(
    $avatar: String
    $fullName: String
    $dateOfBirth: Day
    $gender: Gender
  ) {
    updateAvatar(
      avatar: $avatar
      fullName: $fullName
      dateOfBirth: $dateOfBirth
      gender: $gender
    ) {
      fullName
      mobile
      avatar
    }
  }
`
var IMAGE_PICKER_OPTIONS = {
  title: '添加照片',
  takePhotoButtonTitle: '拍照',
  chooseFromLibraryButtonTitle: '照片',
  cancelButtonTitle: '取消',
  storageOptions: {
    skipBackup: true,
    path: 'images',
    cameraRoll: true,
  },
  maxWidth: 200,
  maxHeight: 200,
  quality: 0.5,
}

@withApollo
export class InfoCompletionScreen extends React.Component {
  state = {
    fullName: null,
    date: null,
    gender: 'FEMALE',
    avatar: null,
  }
  componentWillMount() {
    wechatId = get(this.props.navigation, 'state.params.wechatId', null)
    wechatAvatar = get(this.props.navigation, 'state.params.wechatAvatar', null)
    this.setState({ avatar: wechatAvatar })
  }

  onBackPress = () => this.props.navigation.goBack()

  pickImage = () => {
    ImagePicker.showImagePicker(IMAGE_PICKER_OPTIONS, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else {
        // You can also display the image using data:
        let source = 'data:image/jpeg;base64,' + response.data
        this.setState({
          avatar: source,
        })
      }
    })
  }

  onLogInPress = async () => {
    try {
      const variables = {
        fullName: this.state.fullName,
        dateOfBirth: this.state.date,
        gender: this.state.gender,
        avatar: this.state.avatar,
      }
      const response = await this.props.client.mutate({
        mutation: updateAvatar,
        variables,
      })

      this.props.client.resetStore()
      this.props.navigation.navigate('MainStackNavigator')
    } catch (e) {
      Alert.alert('Error', e.message)
    }
  }

  onToggleGender = clickedButton => {
    if (this.state.gender == 'MALE' && clickedButton == 'FEMALE') {
      this.setState({ gender: 'FEMALE' })
    } else if (this.state.gender == 'FEMALE' && clickedButton == 'MALE') {
      this.setState({ gender: 'MALE' })
    }
  }

  render() {
    const borderColor = '#AAA'
    const now = new Date()
    const dateNow =
      now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate()
    return (
      <ExpandingView>
        <StatusBar hidden={false} />
        <View style={{ backgroundColor: PRIMARY_COLOR }}>
          <Navbar
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}
          >
            <TouchableOpacity
              onPress={this.onBackPress}
              style={{
                paddingLeft: 15,
              }}
            >
              <EntypoIcon
                style={{ backgroundColor: 'transparent', marginTop: 3 }}
                name="chevron-thin-left"
                size={24}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingTop: 10,
                paddingRight: 30,
              }}
              onPress={() => {
                this.props.client.resetStore()
                this.props.navigation.navigate('MainStackNavigator')
              }}
            >
              <Text style={{ color: 'white' }}>跳过</Text>
            </TouchableOpacity>
          </Navbar>
        </View>
        <View
          style={{
            alignItems: 'stretch',
            marginTop: 30,
            paddingHorizontal: PADDING_HORIZONTAL,
          }}
        >
          <Text>请补充您的个人信息，登录后才能获得医生的诊疗服务。</Text>
          <View
            style={{
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.pickImage()
              }}
            >
              <Image
                style={{
                  height: 64,
                  width: 64,
                  borderRadius: 32,
                  marginTop: 30,
                }}
                source={{
                  uri:
                    this.state.avatar ||
                    'https://png.icons8.com/question-mark-filled/ios7/80',
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
            }}
          >
            <BigText>姓名</BigText>
            <FieldInput
              style={{
                height: 40,
                flexGrow: 2,
                marginLeft: 20,
                borderBottomWidth: 1,
                borderColor: borderColor,
                color: 'black',
              }}
              placeholder="输入真实姓名"
              value={null}
              onChangeText={fullName => this.setState({ fullName })}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
            }}
          >
            <BigText>出生日期</BigText>
            <DatePicker
              style={{ width: 160 }}
              date={this.state.date}
              mode="date"
              format="YYYY-MM-DD"
              minDate="1900-01-01"
              maxDate={dateNow}
              confirmBtnText="确认"
              cancelBtnText="取消"
              showIcon={false}
              customStyles={{
                dateInput: {
                  marginLeft: 25,
                },
              }}
              onDateChange={date => {
                this.setState({ date })
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: 20,
            }}
          >
            <BigText>性别</BigText>
            <View
              style={{
                marginLeft: 35,
                justifyContent: 'space-around',
                flexBasis: '50%',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <BigText>男</BigText>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.onToggleGender('MALE')
                }}
              >
                {this.state.gender == 'MALE' ? (
                  <EntypoIcon name="check" size={24} color={PRIMARY_COLOR} />
                ) : (
                  <EntypoIcon
                    name="dot-single"
                    size={24}
                    color={PRIMARY_COLOR}
                  />
                )}
              </TouchableWithoutFeedback>
              <BigText>女</BigText>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.onToggleGender('FEMALE')
                }}
              >
                {this.state.gender == 'FEMALE' ? (
                  <EntypoIcon name="check" size={24} color={PRIMARY_COLOR} />
                ) : (
                  <EntypoIcon
                    name="dot-single"
                    size={24}
                    color={PRIMARY_COLOR}
                  />
                )}
              </TouchableWithoutFeedback>
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
const BigText = styled.Text`font-size: 17;`

const FieldInput = styled.TextInput`
placeholderTextColor="gray"
selectionColor="gray"
underlineColorAndroid="transparent"
keyboardType="numeric"
`

const Navbar = styled.View`
  flex-direction: row;
  align-items: stretch;
  height: 44;
  margin-top: 20;
  marginBottom: 5;
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
