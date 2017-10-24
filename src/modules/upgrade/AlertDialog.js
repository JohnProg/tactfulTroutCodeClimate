import * as React from 'react'
import {
  Modal,
  Text,
  TouchableHighlight,
  View,
  Dimensions,
  StyleSheet,
  BackAndroid,
} from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

export class AlertDialog extends React.Component {
  componentWillReceiveProps(newProps) {}
  static defaultProps = {
    dialogTitle: '提示',
    dialogContent: '',
    dialogLeftBtnTitle: '取消',
    dialogRightBtnTitle: '确定',
    dialogVisible: false,
  }
  render() {
    const {
      dialogVisible,
      dialogTitle,
      dialogContent,
      dialogLeftBtnAction,
      dialogLeftBtnTitle,
      dialogRightBtnAction,
      dialogRightBtnTitle,
    } = this.props
    return (
      <Modal
        visible={dialogVisible}
        transparent={true}
        onRequestClose={() => {}} //如果是Android设备 必须有此方法
      >
        <View style={styles.bg}>
          <View style={styles.dialog}>
            {/* 标题 */}
            <View style={styles.dialogTitleView}>
              <Text style={styles.dialogTitle}>{dialogTitle}</Text>
            </View>
            {/* 内容 */}
            <View style={styles.dialogContentView}>
              <Text style={styles.dialogContent}>{dialogContent}</Text>
            </View>
            {/* 两个按钮 */}
            <View style={styles.dialogBtnView}>
              <TouchableHighlight
                style={styles.dialogBtnViewItem}
                onPress={dialogLeftBtnAction}
              >
                <Text style={styles.leftButton}>{dialogLeftBtnTitle}</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.dialogBtnViewItem}
                onPress={dialogRightBtnAction}
              >
                <Text style={styles.rightButton}>{dialogRightBtnTitle}</Text>
              </TouchableHighlight>
            </View>

            <View />
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  bg: {
    //全屏显示 半透明 可以看到覆盖的控件但是不能操作了
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(52,52,52,0.5)', //rgba  a0-1  其余都是16进制数
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.4,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  dialogTitleView: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  dialogTitle: {
    textAlign: 'center',
    fontSize: 18,
    color: '#000000',
  },
  dialogContentView: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
  },
  dialogContent: {
    textAlign: 'left',
    fontSize: 16,
    color: '#4A4A4A',
  },
  dialogBtnView: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.08,
    flexDirection: 'row',
  },
  dialogBtnViewItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5F2FF',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  leftButton: {
    fontSize: 18,
    color: '#007AFF',
    borderBottomLeftRadius: 8,
  },
  rightButton: {
    fontSize: 18,
    color: '#007AFF',
    borderBottomRightRadius: 8,
  },
})
export default AlertDialog
