import * as React from 'react'
import {
  Text,
  Image,
  AsyncStorage,
  TouchableOpacity,
  Icon,
  FlatList,
  View,
  StyleSheet,
} from 'react-native'
import {
  ExpandingCenteringView,
  ExpandingView,
} from 'react-native-jans-common-components'
import {
  ASYNC_STORAGE_JWT_KEY,
  PRIMARY_COLOR,
  BACKGROUND_COLOR,
} from '../../constants'
import {
  RowWithValueAndRightArrow,
  RowWithRightArrow,
  RowWithValue,
  FlatlistThinSeparator,
} from './styles'
import get from 'lodash/get'
import { gql, graphql } from 'react-apollo'

const userInfo = gql`
  query Profile {
    me {
      _id
      fullName
      avatar
      mobile
      ... on Patient {
        isBound
        boundDetails {
          gender
          dateOfBirth
          height
          weight
        }
      }
    }
  }
`
const updateAvatar = gql`
  mutation($avatarImageData: String!) {
    updateAvatar(avatarImageData: $avatarImageData) {
      fullName
      mobile
      avatar
    }
  }
`

var ImagePicker = require('react-native-image-picker')

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

@graphql(userInfo)
@graphql(updateAvatar)
export class ProfileDetailsScreen extends React.Component {
  state = {}

  componentWillReceiveProps(nextProps) {
    const { me, loading, error } = nextProps.data

    if (!error && !loading && me) {
      const { fullName, avatar, mobile, isBound } = me
      //the avatar image url is randomly modified so the image is refreshed each time
      avatar = avatar + '?' + Math.random()
      console.log(avatar)
      this.setState({
        fullName,
        avatarUrl: avatar,
        mobile,
        isBound,
      })
      if (isBound) {
        const { gender, dateOfBirth, height, weight } = me.boundDetails
        this.setState({
          gender,
          dateOfBirth: dateOfBirth,
          height: height + '厘米',
          weight: weight + '公斤',
        })
      }
    }
  }

  static navigationOptions = ({ navigation }) => ({
    title: '我的',
  })

  async onPictureChosen(avatarImageData) {
    const response = await this.props.mutate({
      variables: {
        avatarImageData,
      },
    })
    if (response && response.data && !response.data.error) {
      const newAvatarUrl =
        response.data.updateAvatar.avatar + '?' + Math.random()
      console.log(response.data)
      this.setState({ avatarUrl: newAvatarUrl })
    }
  }

  pickImage = () => {
    ImagePicker.showImagePicker(IMAGE_PICKER_OPTIONS, response => {
      console.log('Response = ', response)

      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else {
        // You can also display the image using data:
        let source = 'data:image/jpeg;base64,' + response.data
        this.onPictureChosen(source)
      }
    })
  }

  displayGender = gender => {
    if (gender == 'FEMALE') return '女'
    else if (gender == 'MALE') return '男'
    else return '未'
  }

  displayBoundedPatient = () => {
    return (
      <View>
        <FlatList
          // onPress= {()=>this.onAboutUsPress()}
          data={[
            { key: '头像', image: true, onPress: () => {} },
            {
              key: '姓名',
              value: this.state.fullName,
              onPress: () => {},
            },
            {
              key: '性别',
              value: this.displayGender(this.state.gender),
              onPress: () => {},
            },
            { key: '出生日期', value: this.state.dateOfBirth, onPress: () => {} },
            { key: '身高', value: this.state.height, onPress: () => {} },
            { key: '体重', value: this.state.weight, onPress: () => {} },
            {
              key: '手机',
              value: this.state.mobile,
              onPress: () => {},
            },
          ]}
          renderItem={({ item }) => {
            if (item.image)
              return (
                <RowWithRightArrow
                  title="头像"
                  onPress={() => {
                    this.pickImage()
                  }}
                >
                  <Image
                    style={{ height: 30, width: 30, borderRadius: 15 }}
                    source={{
                      uri:
                        this.state.avatarUrl ||
                        'https://png.icons8.com/question-mark-filled/ios7/80',
                    }}
                  />
                </RowWithRightArrow>
              )
            else
              return (
                <RowWithValue
                  title={item.key}
                  value={item.value}
                  onPress={() => item.onPress()}
                />
              )
          }}
          ItemSeparatorComponent={FlatlistThinSeparator}
        />
      </View>
    )
  }
  displayUnboundedPatient = () => {
    return (
      <View>
        <FlatList
          // onPress= {()=>this.onAboutUsPress()}
          data={[
            { key: '头像', image: true, onPress: () => {} },
            {
              key: '姓名',
              indicator: true,
              value: this.state.fullName,
              onPress: () => {},
            },
            {
              key: '手机',
              value: this.state.mobile,
              onPress: () => {},
            },
          ]}
          renderItem={({ item }) => {
            if (item.image)
              return (
                <RowWithRightArrow
                  title="头像"
                  onPress={() => {
                    this.pickImage()
                  }}
                >
                  <Image
                    style={{ height: 30, width: 30, borderRadius: 15 }}
                    source={{
                      uri:
                        this.state.avatarUrl ||
                        'https://png.icons8.com/question-mark-filled/ios7/80',
                    }}
                  />
                </RowWithRightArrow>
              )
            else if (item.indicator)
              return (
                <RowWithValueAndRightArrow
                  title={item.key}
                  value={item.value}
                  onPress={() => item.onPress()}
                />
              )
            else
              return (
                <RowWithValue
                  title={item.key}
                  value={item.value}
                  onPress={() => item.onPress()}
                />
              )
          }}
          ItemSeparatorComponent={FlatlistThinSeparator}
        />
      </View>
    )
  }

  render() {
    return (
      <ExpandingView>
        {this.state.isBound ? (
          this.displayBoundedPatient()
        ) : (
          this.displayUnboundedPatient()
        )}
      </ExpandingView>
    )
  }
}
