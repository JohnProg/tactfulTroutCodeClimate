import * as React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/Entypo'
import { BACKGROUND_COLOR } from '../../constants'

export const RowWithValueAndRightArrow = ({ title, value, onPress }) =>
  <Row title={title} onPress={onPress}>
    <Value>
      {value}
    </Value>
    <Icon
      style={{ marginTop: 3, marginRight: 6 }}
      name="chevron-small-right"
      size={25}
      color="#bbb"
    />
  </Row>
export const RowWithIconAndRightArrow = ({ icon, title, onPress }) =>
  <Container onPress={onPress}>
    <Image source={icon} resizeMode="contain" style={{ width: 25 }} />
    <Title style={{ marginLeft: 20 }}>
      {title}
    </Title>
    <Icon
      style={{ marginTop: 3, marginRight: 6 }}
      name="chevron-small-right"
      size={25}
      color="#bbb"
    />
  </Container>

export const RowWithValue = ({ title, value, onPress }) =>
  <Row title={title} onPress={onPress}>
    <Value>
      {value}
    </Value>
    <Icon style={{ marginTop: 3, marginRight: 15 }} />
  </Row>

export const RowWithRightArrow = ({ title, onPress, children }) =>
  <Row title={title} onPress={onPress}>
    {children}
    <Icon
      style={{ marginTop: 3, marginRight: 6 }}
      name="chevron-small-right"
      size={25}
      color="#bbb"
    />
  </Row>

export const Row = ({ title, onPress, children }) =>
  <Container onPress={onPress}>
    <Title>
      {title}
    </Title>
    {children}
  </Container>

export const FlatlistThinSeparator = () =>
  <View
    style={{
      height: 0.9,
      borderColor: BACKGROUND_COLOR,
    }}
  />

const Container = styled.TouchableOpacity`
  background-color: white;
  padding-left: 15;
  height: 44;
  flex-direction: row;
  align-items: center;
`

const Title = styled.Text`
  color: black;
  font-size: 17;
  margin-right: auto;
`

const Value = styled.Text`
  color: gray;
  font-size: 17;
  margin-right: 0;
`
