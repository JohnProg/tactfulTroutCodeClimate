import * as React from 'react'
import { View, Text, Image } from 'react-native'
import styled from 'styled-components/native'
import { PRIMARY_COLOR } from '../../../constants'

export const ChatButton = ({ onPress }) =>
  <StyledChatButton color={PRIMARY_COLOR} onPress={() => onPress()}>
    <Image
      style={{ height: 20, width: 20 }}
      source={require('../../../../assets/imgs/tab-icon-doctor-3.png')}
    />
    <Text style={{ fontSize: 16, color: '#fff', marginLeft: 10 }}>问医生</Text>
  </StyledChatButton>

const StyledChatButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 20;
  height: 40;
  margin-left: 40;
  margin-right: 40;
  background-color: ${props => props.color};
`
