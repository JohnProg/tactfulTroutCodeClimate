import * as React from 'react'
import get from 'lodash/get'
import orderBy from 'lodash/orderBy'
import isEqual from 'lodash/isEqual'
import {
  Button,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native'
import { graphql, compose } from 'react-apollo'
import { GiftedChat, Send } from 'react-native-gifted-chat'
import { ExpandingView } from 'react-native-jans-common-components'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import PressMeButton from 'react-native-press-me-button'
import { AudioRecorder, AudioUtils } from 'react-native-audio'
import * as RNFS from 'react-native-fs'
const Sound = require('react-native-sound')
const ImagePicker = require('react-native-image-picker')

import Bubble from '../components/Bubble'
import { PRIMARY_COLOR } from '../../../constants'
import { sendTextMessage, sendAudioMessage, sendImageMessage } from '../actions'
import { fetchMessages, subscriptionMessage } from '../actions'

const audioPath = AudioUtils.DocumentDirectoryPath + '/voiceRecording.aac'
const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

class ChatScreenCom extends React.Component {
  state = {
    me: {},
    chatRoomId: '',
    messages: [],
    recording: false,
    hasPermission: undefined,
  }
  componentWillMount() {
    this.props.subscriptionMessage()

  }
  async componentDidMount() {
    Sound.setCategory('Playback', true)

    this._checkPermission().then(hasPermission => {
      this.setState({ hasPermission })

      if (!hasPermission) return

      this.prepareRecordingPath(audioPath)

      AudioRecorder.onFinished = data => {
        // Android callback comes in the form of a promise instead.
        if (Platform.OS === 'ios') {
          this._finishRecording(data.status === 'OK', data.audioFileURL)
        }
      }
    })

    // this.fetchMessages()

    // this.intervalId = setInterval(this.fetchMessages, 5000)
  }

  _checkPermission() {
    if (Platform.OS !== 'android') {
      return Promise.resolve(true)
    }

    const rationale = {
      title: 'Microphone Permission',
      message: '控血压 needs access to your microphone so you can record audio.',
    }

    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      rationale,
    ).then(result => {
      console.log('Permission result:', result)
      return result === true || result === PermissionsAndroid.RESULTS.GRANTED
    })
  }

  prepareRecordingPath(audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'Low',
      AudioEncoding: 'aac',
      AudioEncodingBitRate: 32000,
    })
  }

  componentWillReceiveProps(np) {
    const { fetchMessages } = this.props
    if(!isEqual(fetchMessages, np.fetchMessages)
      && !np.fetchMessages.loading && np.fetchMessages.me) {
      const { me } = np.fetchMessages
      const chatRoomId = get(me, 'boundDetails.chatRoom._id')

      let messages = get(me, 'boundDetails.chatRoom.messages', [])

      messages = messages.map(message => ({
        _id: message._id,
        text: message.text,
        audioUrl: message.audioUrl,
        image: message.imageUrl,
        createdAt: message.createdAt,
        user: {
          _id: message.sender._id,
          name: message.sender.fullName,
          avatar: message.sender.avatar,
        },
      }))

      messages = orderBy(messages, ['createdAt'], ['desc'])

      this.setState({
        messages,
        chatRoomId,
        me: {
          _id: me._id,
          name: me.fullName,
          avatar: me.avatar,
        },
      })
    }
  }

  onSend = messages => {
    const variables = {
      chatRoomId: this.state.chatRoomId,
      text: messages[0].text,
    }

    this.props.sendTextMessage({
      variables,
    })
  }

  onRecordPressIn = () => this.startRecording()
  onRecordPressOut = () => this.stopRecording()

  startRecording = async () => {
    if (this.state.recording) {
      console.warn('Already recording!')
      return
    }

    if (!this.state.hasPermission) {
      console.warn("Can't record, no permission granted!")
      return
    }

    this.prepareRecordingPath(audioPath)

    this.setState({ recording: true })

    const filePath = await AudioRecorder.startRecording()
  }

  stopRecording = async () => {
    if (!this.state.recording) {
      console.warn("Can't stop, not recording!")
      return
    }

    this.setState({ stoppedRecording: true, recording: false })

    try {
      const filePath = await AudioRecorder.stopRecording()

      if (Platform.OS === 'android') {
        this._finishRecording(true, filePath)
      }
      return filePath
    } catch (error) {
      console.error(error)
    }
  }

  _finishRecording = async (didSucceed, filePath) => {
    console.log(filePath)

    const base64 = await RNFS.readFile(filePath, 'base64')

    const variables = {
      chatRoomId: this.state.chatRoomId,
      base64EncodedAudioData: base64,
    }

    this.props.sendAudioMessage({ variables })
  }

  onPicturePress = () => {
    const IMAGE_PICKER_OPTIONS = {
      title: '发送图片',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '照片',
      cancelButtonTitle: '取消',
      storageOptions: {
        skipBackup: true,
        path: 'images',
        cameraRoll: true,
      },
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.5,
    }
    ImagePicker.showImagePicker(IMAGE_PICKER_OPTIONS, this.didTakePicture)
  }

  didTakePicture = response => {
    console.log(response)

    if (!response.didCancel && !response.error) {
      const variables = {
        chatRoomId: this.state.chatRoomId,
        base64EncodedImageData: response.data,
      }
      this.props.sendImageMessage({ variables })
    }
  }

  renderChatFooter = () => (
    <View style={{ height: 40, margin: 20, flexDirection: 'row' }}>
      <PressMeButton
        style={{ marginRight: 10 }}
        height={40}
        width={windowWidth / 2 - 30}
        title="录音"
        titleStyle={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}
        backgroundColor="#e9e9ef"
        onPressIn={this.onRecordPressIn}
        onPressOut={this.onRecordPressOut}
        buttonColor={PRIMARY_COLOR}
        edgeHeight={5}
        cornerRadius={1}
        shadowStyle={{
          shadowColor: '#0000AA',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 2,
          elevation: 2,
        }}
      />
      <PressMeButton
        style={{ marginLeft: 10 }}
        height={40}
        width={windowWidth / 2 - 30}
        title="图片"
        titleStyle={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}
        backgroundColor="#e9e9ef"
        onPress={this.onPicturePress}
        buttonColor={PRIMARY_COLOR}
        edgeHeight={5}
        cornerRadius={1}
        shadowStyle={{
          shadowColor: '#0000AA',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 2,
          elevation: 2,
        }}
      />
    </View>
  )

  renderBubble = props => {
    // console.log(props)
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          },
          right: {
            backgroundColor: PRIMARY_COLOR,
          },
        }}
      />
    )
  }
  renderSend = props => {
    return <Send {...props}>
      <View style={{
        marginRight: 10,
        marginBottom: 4,
        padding: 10,
        backgroundColor: '#e9e9ef',
        borderRadius: 5,
      }}
      >
        <Text style={{fontSize: 16}}>发送</Text>
      </View>
    </Send>
  }

  render() {
    return (
      <ExpandingView>
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          user={this.state.me}
          renderChatFooter={this.renderChatFooter}
          timeFormat="HH:mm"
          placeholder="请输入..."
          dateFormat="YYYY年MM月DD日"
          renderBubble={this.renderBubble}
          renderSend={this.renderSend}
        />
        {/*Platform.OS === 'android' && <KeyboardSpacer />*/}
        {this.state.recording && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              width: 150,
              height: 150,
              borderRadius: 5,
              backgroundColor: 'white',
              borderColor: 'lightgray',
              borderWidth: 1,
              top: 75,
              left: (windowWidth - 150) / 2,
            }}
          >
            <ActivityIndicator
              style={{ marginBottom: 10 }}
              color={PRIMARY_COLOR}
              size="large"
              animating
            />
            <Text style={{ fontSize: 22 }}>录音中...</Text>
          </View>
        )}
      </ExpandingView>
    )
  }
}

export const ChatScreen = compose(
  graphql(sendTextMessage, { name: 'sendTextMessage' }),
  graphql(sendAudioMessage, { name: 'sendAudioMessage' }),
  graphql(sendImageMessage, { name: 'sendImageMessage' }),
  graphql(fetchMessages, {
    name: 'fetchMessages',
    props: props => ({
      ...props,
      subscriptionMessage: () =>
        props.fetchMessages.subscribeToMore({
          document: subscriptionMessage,
          updateQuery: (pre, { subscriptionData }) => {
            if(!subscriptionData.data) {
              return pre
            }
            return {
              ...pre,
              me: {
                ...pre.me,
                boundDetails: {
                  ...pre.me.boundDetails,
                  chatRoom: {
                    ...pre.me.boundDetails.chatRoom,
                    messages: [
                      subscriptionData.data.chatMessageAdded,
                      ...pre.me.boundDetails.chatRoom.messages,
                    ]
                  }
                }
              }
            }
          }
        })
      })
  }),
)(ChatScreenCom)
