import * as React from 'react'
import {
  Image,
  Animated,
  Dimensions,
} from 'react-native'
import styled from 'styled-components/native'

export class InstructionsImage extends React.Component {
  state = {
    translateXValue: new Animated.Value(0),
    opacityValue: new Animated.Value(0),
  }

  async componentDidMount() {
    const timing = Animated.timing
    Animated.parallel(
      ['translateXValue', 'opacityValue'].map(property =>
        timing(this.state[property], {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ),
    ).start()
  }

  render() {
    const { discover, batteryLevel, status } = this.props
    return <InstructionsImageContainer
      style={{
        transform: [{
          translateX: this.state.translateXValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-30, 0],
          }),
        }],
        opacity: this.state.opacityValue,
      }}
      source={require('../../../../assets/imgs/instructions.png')}
    />
  }
}

const WINDOW_WIDTH = Dimensions.get('window').width
const IMAGE_WIDTH = WINDOW_WIDTH * 0.75
const IMAGE_HEIGHT = IMAGE_WIDTH * 0.68

const InstructionsImageContainer = styled(Animated.Image)`
  width: ${IMAGE_WIDTH};
  height: ${IMAGE_HEIGHT};
  margin-bottom: 40;
`
