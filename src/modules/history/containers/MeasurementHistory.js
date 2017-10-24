import * as React from 'react'
import * as wechat from 'react-native-wechat'
import { gql, graphql, withApollo } from 'react-apollo'
import { get } from 'lodash'
import moment from 'moment'
import nibbana from 'nibbana'
import styled from 'styled-components/native'

import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import {
  ExpandingView,
  ExpandingCenteringView,
} from 'react-native-jans-common-components'
import { PRIMARY_COLOR } from '../../../constants'
import {
  getSystolicLevelByStandard,
  getDiastolicLevelByStandard,
} from '../../measuring/common'
import MEASUREMENT_STATES from '../measureState'

const measurementHistoryQuery = gql`
  query MeasurementHistory {
    me {
      _id
      ... on Patient {
        bloodPressureMeasurements(limit: 1000) {
          systolic
          diastolic
          heartRate
          measuredAt
          measurementContext
        }
      }
    }
  }
`

@graphql(measurementHistoryQuery, { options: { fetchPolicy: 'network-only' } })
export class MeasurementHistoryScreen extends React.Component {

  componentDidMount() {
    nibbana.logEvent('Measurement history viewed')
  }

  renderItem = ({
    item: {
      systolic,
      diastolic,
      heartRate,
      measuredAt,
      measurementContext,
      isShowDate,
    },
  }) => {

    const systolicColor = getSystolicLevelByStandard(systolic).color
    const diastolicColor = getDiastolicLevelByStandard(diastolic).color
    const today = moment(new Date()).format('MM月DD日')
    let measureDate = moment(measuredAt).format('MM月DD日')

    measureDate = measureDate === today ? '今天' : measureDate

    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'stretch',
          backgroundColor: '#f4f4f2',
        }}
      >
        {isShowDate && (
          <Text
            style={{
              fontSize: 16,
              padding: 10,
              marginLeft: 0,
              marginRight: 0,
              backgroundColor: '#f4f4f2',
              textAlign: 'center',
              color: 'hsla(0, 0%, 0%, 0.64)'
            }}
          >
            {measureDate}
          </Text>
        )}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: 20,
            paddingBottom: 10,
            paddingRight: 15,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'stretch',
            }}
          >
            <Text style={{ fontSize: 28, fontWeight: 'bold', marginRight: 10 }}>
              <Text style={{ color: systolicColor }}>{systolic}/</Text>
              <Text style={{ color: diastolicColor }}>{diastolic}</Text>
            </Text>
            <StyledInfo>毫米汞柱</StyledInfo>
            <Text
              style={{
                fontSize: 28,
                color: '#bdbdbd',
                fontWeight: 'bold',
                marginRight: 10,
                marginLeft: 10,
              }}
            >
              {heartRate}
            </Text>
            <StyledInfo>脉搏</StyledInfo>
          </View>
          <Text style={{color: 'hsla(0, 0%, 0%, 0.54)'}}>{moment(measuredAt).format('HH:mm')}</Text>
        </View>
        {
          measurementContext.length ? <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              flexDirection: 'row',
              flexWrap: 'wrap',
              padding: 10,
              paddingTop: 0,
            }}>
            {measurementContext.map(context => <StyledText key={context}>
              {MEASUREMENT_STATES[context]}
            </StyledText>)}
          </View> : null
        }
      </View>
    )
  }

  renderSeparator = () => (
    <View
      style={{ backgroundColor: 'hsla(0, 0%, 0%, 0.12)', height: 1 }}
    />
  )

  render() {
    const { me, loading, error } = this.props.data

    if (loading) {
      return (
        <ExpandingCenteringView>
          <ActivityIndicator animating size="large" color={PRIMARY_COLOR} />
        </ExpandingCenteringView>
      )
    }

    if (error) {
      return (
        <ExpandingCenteringView>
          <Text>{JSON.stringify(error)}</Text>
        </ExpandingCenteringView>
      )
    }

    const data = get(me, 'bloodPressureMeasurements', [])
    let dateArr = []

    const dataWithKeys = data.map((measureItem, i) => {
      const temp = { ...measureItem }
      let measureDate = moment(measureItem.measuredAt).format('MMDD')

      if (dateArr.indexOf(measureDate) > -1) {
        //already exits
        temp.isShowDate = false
      } else {
        dateArr.push(measureDate)
        temp.isShowDate = true
      }
      return { ...temp, key: i }
    })

    if (data.length === 0) {
      return (
        <ExpandingCenteringView>
          <Text>暂无测量数据</Text>
        </ExpandingCenteringView>
      )
    }

    return (
      <ExpandingView>
        <FlatList
          data={dataWithKeys}
          keyExtractor={m => m.key}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </ExpandingView>
    )
  }
}

const StyledText= styled.Text`
  border: 1px solid rgb(207, 207, 207);
  border-radius: 5;
  margin-left: 10;
  margin-bottom: 5;
  font-size: 12;
  padding-top: 5;
  padding-left: 8;
  padding-bottom: 5;
  padding-right: 8;
  color: 'hsla(0, 0%, 0%, 0.54)';
`
const StyledInfo= styled.Text`
  font-size: 12;
  color: 'hsla(0, 0%, 0%, 0.54)';
`
