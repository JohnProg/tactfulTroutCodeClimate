import * as React from 'react'
import {
  View,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native'
import styled from 'styled-components/native'
import AttentionGrabber from 'react-native-attention-grabber'
import { CircleBall } from './CircleBall'

import { PRIMARY_COLOR } from '../../../constants'

const WINDOW_WIDTH = Dimensions.get('window').width
export const BUTTON_SIZE = WINDOW_WIDTH * 0.67

export class BigButton extends React.Component {
  state = {
    isPressed: false,
  }

  render() {
    const {
      onPress,
      status,
      isPressed,
      distanceFromParentTopToButtonCenter,
      children,
    } = this.props
    const showCircle = /DISCOVERING|CONNECTING/g.test(status)
    const pulse = !/DISCOVERING|CONNECTING|MEASURING/g.test(status)
    return (
      <ContainerOutside
        distanceFromParentTopToButtonCenter={
          distanceFromParentTopToButtonCenter
        }
      >
        <AttentionGrabber
          style={{ flex:1 }}
          pulseDuration={2500}
          pulse={pulse}
        >
          <Touchable
            onPress={onPress}
            onPressIn={() => this.setState({ isPressed: true })}
            onPressOut={() => this.setState({ isPressed: false })}
          >
            <ContainerInside
              isPressed={this.state.isPressed}
              style={{
                shadowOffset: { width: 1, height: 3 },
              }}
            >
              {children}
            </ContainerInside>
          </Touchable>
          {showCircle && <CircleBall />}
        </AttentionGrabber>
      </ContainerOutside>
    )
  }
}

const ContainerOutside = styled(Animated.View)`
  width: ${BUTTON_SIZE};
  height: ${BUTTON_SIZE};
  position: absolute;
  top: ${p => p.distanceFromParentTopToButtonCenter - WINDOW_WIDTH * 0.67 / 2};
  left: ${(WINDOW_WIDTH - BUTTON_SIZE) / 2};
  right: ${(WINDOW_WIDTH - BUTTON_SIZE) / 2};
  flex-grow: 0;
`

const Touchable = styled.TouchableWithoutFeedback`flex: 1;`

const ContainerInside = styled(Animated.View)`
  background-color: white;
  flex: 1;
  justify-content: center;
  align-items: center;
  shadow-color: rgba(0,0,0,0.5);
  shadow-opacity: ${p => (p.isPressed ? 0.3 : 0.8)};
  shadow-radius: ${p => (p.isPressed ? 1 : 6)};
  elevation: ${p => (p.isPressed ? 2 : 15)};
  border-radius: ${BUTTON_SIZE / 2};
`

export const BigButtonText = styled.Text`
  color: ${PRIMARY_COLOR};
  font-size: 25;
`

export const BigButtonInLineBtn = styled.TouchableOpacity`
  height: 30;
  padding: 10px 20px;
  background-color: ${PRIMARY_COLOR};
  border-radius: 20;
  justify-content: center;
  align-items: center;
`

export const InlineBtnText = styled.Text`
  text-align: center;
  color: #ffffff;
`
