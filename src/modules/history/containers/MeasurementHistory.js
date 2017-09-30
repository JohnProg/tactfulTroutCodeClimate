import * as React from 'react'
import * as wechat from 'react-native-wechat'
import { gql, graphql, withApollo } from 'react-apollo'
import { get } from 'lodash'
import moment from 'moment'
import nibbana from 'nibbana'

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
        }
      }
    }
  }
`

@graphql(measurementHistoryQuery, { options: { fetchPolicy: 'network-only' } })
export class MeasurementHistoryScreen extends React.Component {
  componentDidMount() {
    nibbana.trackEvent('Measurement history viewed')
  }

  renderItem = ({ item: { systolic, diastolic, heartRate, measuredAt } }) => {
    const systolicColor = getSystolicLevelByStandard(systolic).color
    const diastolicColor = getDiastolicLevelByStandard(diastolic).color

    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'stretch',
            width: 180,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: 'bold', marginRight: 10 }}>
            <Text style={{ color: systolicColor }}>{systolic}/</Text>
            <Text style={{ color: diastolicColor }}>{diastolic}</Text>
          </Text>
          <Text>毫米汞柱</Text>
        </View>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginRight: 10 }}>
          {heartRate}
        </Text>
        <Text style={{ marginRight: 'auto' }}>脉搏</Text>
        <Text>{moment(measuredAt).format('MM月DD日 h:mm')}</Text>
      </View>
    )
  }

  renderSeparator = () => (
    <View
      style={{ backgroundColor: '#ccc', height: StyleSheet.hairlineWidth }}
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
    const dataWithKeys = data.map((v, i) => ({ ...v, key: i }))

    if (data.length === 0) {
      return (
        <ExpandingCenteringView>
          <Text>No measurements</Text>
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
