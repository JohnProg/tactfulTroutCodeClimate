import * as React from 'react'
import {
  View,
  Animated,
  Dimensions,
} from 'react-native'
import styled from 'styled-components/native'

import { PRIMARY_COLOR } from '../../../constants'
import { BUTTON_SIZE } from '../common'

export class CircleBall extends React.Component {
  state = {
    circle: new Animated.Value(0),
  }
  startAntimate = () => {
    const {
      duration = 6000,
      toValue = 1,
    } = this.props
    Animated.loop(Animated.timing(this.state.circle, {
      toValue,
      duration,
      useNativeDriver: true,
    })).start()
  }
  async componentDidMount() {
    this.startAntimate()
  }

  async componentWillUnmount() {
    this.state.circle.stopAnimation()
  }

  render() {

    const circle = this.state.circle.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    })

    return (
      <CircleContainer
        style={{
          transform: [{rotate: circle}]
        }}
      >
        <StyledCircleBall />
      </CircleContainer>
    )
  }
}
const size = BUTTON_SIZE + 10
const CircleContainer = styled(Animated.View)`
  width: ${size};
  height: ${size};
  position: absolute;
  top: -6;
  left: -6;
`

const StyledCircleBall= styled(Animated.View)`
  background-color: ${PRIMARY_COLOR};
  height: 14;
  width: 14;
  border-radius: 7;
  border: 3px solid #ffffff;
  position: absolute;
  align-self: center;
`
