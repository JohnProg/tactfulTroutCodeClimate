import * as React from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Platform,
  Text,
} from 'react-native'
import styled from 'styled-components/native'
import { MeasureTime } from './MeasureTime'
import { InstructionsImage } from './InstructionsImage'
import { PRIMARY_COLOR } from '../../../constants'

export const TopHalf = ({ flex, onHistoryPress, status }) => (
  <Container flex={flex}>
    <NavBar>
      <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>测血压</Text>
      <TouchableOpacity
        onPress={onHistoryPress}
        style={{
          position: 'absolute',
          top: 13,
          right: 15,
        }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>血压记录</Text>
      </TouchableOpacity>
    </NavBar>
    <InfoContainer>
      {
        status === 'PRE_INITIAL' ? <MeasureTime /> : <InstructionsImage />
      }
    </InfoContainer>
  </Container>
)

const Container = styled.View`
  background-color: ${PRIMARY_COLOR};
  flex: ${p => p.flex};
  justify-content: center;
  align-items: center;
`

const NavBar = styled.View`
  align-self: stretch;
  height: 44;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: ${Platform.OS === 'ios' ? 20 : 0};
  position: relative;
`

const InfoContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
