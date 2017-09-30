import { Alert } from 'react-native'
const { setJSExceptionHandler } = require('react-native-exception-handler')

const errorHandler = (e, isFatal) => {
  if (isFatal) {
    Alert.alert('请把错误截图发送给客服人员，尝试关闭APP再重新打开', `${e.name}: ${e.message}`, [
      {
        text: 'OK',
        onPress: () => {
          // RNRestart.Restart(); Do nothing
        },
      },
    ])
  } else {
    console.log(e) // So that we can see it in the ADB logs in case of Android if needed
  }
}

setJSExceptionHandler(errorHandler)
