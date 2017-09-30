import * as React from 'react'
import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import styled from 'styled-components/native'
import moment from 'moment'
import { gql, graphql } from 'react-apollo'
import get from 'lodash/get'

const titleMaps = {
  isMorning: {
    title: '今天早上',
    timeTitle: '6:00 ~ 9:00之间',
  },
  isEvening: {
    title: '今天晚上',
    timeTitle: '18:00 ~ 21:00之间',
  },
  isTomorrow: {
    title: '明天早上',
    timeTitle: '6:00 ~ 9:00之间',
  }
}

const measureTimeQuery = gql`
  query MeasureTimeQuery($currentTime: Date) {
    me {
      _id
      ... on Patient {
        currentMeasurePeriod(currentTime: $currentTime)
      }
    }
  }
`
@graphql(measureTimeQuery, {
  options: () => ({
    variables: {
      currentTime: new Date()
    }
  })
})
export class MeasureTime extends React.Component {
  render() {
    const status = get(this.props, 'data.me.currentMeasurePeriod', 'isMorning')
    return <Container>
      <InfoText isMarginTop>建议下次测量血压时间</InfoText>
      <InfoText fontSize={20}>{titleMaps[status].title}</InfoText>
      <InfoText fontSize={14}>{titleMaps[status].timeTitle}</InfoText>
    </Container>
  }
}

const WINDOW_HEIGHT = Dimensions.get('window').height

const InfoText = styled.Text`
  font-family: PingFangSC-Regular;
  font-size: ${props => props.fontSize || 16};
  color: #ffffff;
  margin-bottom: 5;
  margin-top: ${props => props.isMarginTop ? (WINDOW_HEIGHT / 18) : 0};
`

const Container = styled.View`
  flex: 1;
  align-items: center;
`
