import * as React from 'react'
import { Observable } from 'rxjs'
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native'
import { ExpandingView } from 'react-native-jans-common-components'
import styled from 'styled-components/native'

import { PRIMARY_COLOR } from '../../../constants'

export class BottomHalf extends React.Component {
  state = {
    translateYValue: new Animated.Value(0),
  }

  async componentDidMount() {
    Animated.timing(this.state.translateYValue, {
      toValue: -300,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }

  render() {
    const { discover, batteryLevel, status } = this.props
    return (
      <Container>
        <ContentWrapper>
          {batteryLevel !== null && (
            <BatteryText>血压计剩余电量 {batteryLevel}%</BatteryText>
          )}
          <DiscoverOtherDevicesButton
            onPress={() => discover(true)}
          >
            <DiscoverOtherDevicesText>连接其他血压计</DiscoverOtherDevicesText>
          </DiscoverOtherDevicesButton>
        </ContentWrapper>
        <TranslateView
          style={{
            transform: [{ translateY: this.state.translateYValue }],
          }}
        />
      </Container>
    )
  }
}

const WINDOW_WIDTH = Dimensions.get('window').width

const TranslateView = styled(Animated.View)`
  background-color: ${PRIMARY_COLOR};
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
`

const Container = styled.View`
  background-color: hsl(0, 0%, 97%);
  flex: 1;
  overflow: hidden;
`

const ContentWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: ${WINDOW_WIDTH * 0.67 / 2};
`

const BatteryText = styled.Text`
  font-size: 16;
  color: ${PRIMARY_COLOR};
  margin-bottom: 15;
`

const DiscoverOtherDevicesButton = styled.TouchableOpacity`
  height: 20;
  border-bottom-width: 1;
  border-bottom-color: ${PRIMARY_COLOR};
  justify-content: center;
  align-items: center;
`

const DiscoverOtherDevicesText = styled.Text`
  margin-horizontal: 2;
  font-size: 12;
  color: ${PRIMARY_COLOR};
`
