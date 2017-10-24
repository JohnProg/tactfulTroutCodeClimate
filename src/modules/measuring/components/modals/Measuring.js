import * as React from 'react'
import {
  View,
  Animated,
  Easing,
  PixelRatio,
  Dimensions,
  Modal,
} from 'react-native'
import styled from 'styled-components/native'

import { PRIMARY_COLOR } from '../../../../constants'
import { BUTTON_SIZE } from '../../common'
import { CircularProgress } from '../CircularProgress'

export class MeasuringModal extends React.Component {
  state = { scroll: new Animated.Value(0) }

  componentWillReceiveProps(newProps) {
    if (!this.props.visible && newProps.visible) {
      Animated.loop(
        Animated.timing(this.state.scroll, {
          toValue: 1,
          duration: 8000,
          easing: Easing.linear,
        }),
      ).start()
    }
  }

  render() {
    const { heightOfTopSection, cancelMeasurement, visible } = this.props

    const imageXOffset = this.state.scroll.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.5 * -978 / PixelRatio.get()],
    })

    return (
      <Modal
        animationType="fade"
        transparent
        onRequestClose={cancelMeasurement}
        visible={visible}
      >
        <Container>
          <View />
          <TextAboveContainer heightOfTopSection={heightOfTopSection}>
            <InstructionLabel style={{ marginBottom: 10 }}>
              开始测量
            </InstructionLabel>
            <InstructionLabel style={{ marginBottom: 10 }}>
              请保持平和安静
            </InstructionLabel>
            <InstructionLabel>均匀呼吸</InstructionLabel>
          </TextAboveContainer>
          <CircleContainer>
            <Circle
              heightOfTopSection={heightOfTopSection}
              style={{
                shadowOffset: { width: 0, height: 3 },
              }}
            >
              <ImageContainer>
                <PulseImage
                  resizeMode="cover"
                  style={{
                    transform: [{ translateX: imageXOffset }],
                  }}
                  source={require('../../../../../assets/imgs/w3.png')}
                />
              </ImageContainer>
            </Circle>
            <CircularProgress />
          </CircleContainer>
          <CancelButton
            onPress={cancelMeasurement}
            heightOfTopSection={heightOfTopSection}
          >
            <CancelText>点击停止</CancelText>
          </CancelButton>
          <View />
        </Container>
      </Modal>
    )
  }
}

const WINDOW_HEIGHT = Dimensions.get('window').height
const WINDOW_WIDTH = Dimensions.get('window').width
const VERTICAL_MARGIN_BUTTON = 40

const Container = styled.View`
  flex: 1;
  justify-content: space-between;
  align-items: center;
  background-color: ${PRIMARY_COLOR};
`

const TextAboveContainer = styled.View`align-items: center;`

const InstructionLabel = styled.Text`
  color: white;
  font-size: 22;
`
const BUTTON_SIZE_HACK = BUTTON_SIZE + 20
const CircleContainer = styled.View`
  width: ${BUTTON_SIZE_HACK};
  height: ${BUTTON_SIZE_HACK};
  align-items: center;
  justify-content: center;
`
const Circle = styled.View`
  margin-bottom: 10;
  margin-left: 10;
  margin-top: 10;
  margin-right: 10;
  width: ${BUTTON_SIZE};
  height: ${BUTTON_SIZE};
  background-color: white;
  justify-content: center;
  align-items: center;
  position: absolute;
  shadow-color: black;
  shadow-opacity: 0.8;
  shadow-radius: 6;
  elevation: 15;
  border-radius: ${BUTTON_SIZE};
`

const ImageContainer = styled.View`
  width: ${BUTTON_SIZE};
  height: ${BUTTON_SIZE};
  justify-content: center;
  align-items: center;
  border-radius: ${BUTTON_SIZE / 2};
  overflow: hidden;
`

const PulseImage = styled(Animated.Image)`
  margin: 5px;
  width: ${0.5 * 4890 / PixelRatio.get()};
  height: ${0.5 * 227 / PixelRatio.get()};
`

const CancelButton = styled.TouchableOpacity`
  height: 30;
  border-width: 1;
  border-color: white;
  border-radius: 15;
  justify-content: center;
  align-items: center;
`

const CancelText = styled.Text`
  color: white;
  font-size: 15;
  margin-horizontal: 10;
`
