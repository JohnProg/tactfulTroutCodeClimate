import * as React from 'react'
import { get, invert } from 'lodash'
import moment from 'moment'
import {
  Button,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
  Text,
  Modal,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native'
import styled from 'styled-components/native'
import {
  ExpandingView,
  ExpandingCenteringView,
} from 'react-native-jans-common-components'
import { gql, graphql } from 'react-apollo'
import { ASYNC_STORAGE_SAVED_MAC_KEY, PRIMARY_COLOR } from '../../../constants'
import {
  BambooRulers,
  LCD,
  LegendModal,
  MeasurementContextModal,
} from '../components'
import { ChatButton } from '../../chat/components'
import MEASUREMENT_STATES from '../measurementStates'

import { MeasureTrend } from '../components/MeasureTrend'

const APP_VERSION = require('../../../../package.json').version
const MEASUREMENT_STATES_ENUM_TO_LABEL = invert(MEASUREMENT_STATES)

const isBoundQuery = gql`
  query IsBound {
    me {
      _id
      ... on Patient {
        isBound
      }
    }
  }
`

const uploadResultMutation = gql`
  mutation UploadBloodPressureMeasurement(
    $systolic: Int!
    $diastolic: Int!
    $heartRate: Int!
    $measurementDeviceAddress: String!
    $measurementDeviceModel: String!
    $measuredAt: Date!
    $measurementContext: [MeasurementState!]!
    $deviceContext: DeviceContextInput!
  ) {
    uploadBloodPressureMeasurement(
      systolic: $systolic
      diastolic: $diastolic
      heartRate: $heartRate
      measurementDeviceAddress: $measurementDeviceAddress
      measurementDeviceModel: $measurementDeviceModel
      measuredAt: $measuredAt
      measurementContext: $measurementContext
      deviceContext: $deviceContext
    ) {
      heartRate
    }
  }
`

@graphql(isBoundQuery)
@graphql(uploadResultMutation)
export class MeasuringResultScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { level, createdAt } = navigation.state.params
    const dateStr = createdAt ? moment(createdAt).format('MM月D日 hh:mm') : ''
    return {
      title: `测量结果 ${dateStr}`,
      headerStyle: { backgroundColor: level.color },
    }
  }

  didUploadResults = false

  state = {
    isExplanationModalVisible: false,
    isMeasurementContextModalVisible: true,
    measurementContext: [],
    canChat: null,
  }

  componentWillReceiveProps(nextProps) {
    const { me, loading, error } = nextProps.data

    if (me && !loading && !error) {
      this.setState({ canChat: me.isBound })
    }
  }

  onChatButtonPress = () => this.props.navigation.navigate('ChatScreen')

  toggleExplanationModal = () =>
    this.setState({
      isExplanationModalVisible: !this.state.isExplanationModalVisible,
    })

  onSubmitTagsPress = async () => {
    const {
      systolic,
      diastolic,
      pulse,
      level,
      isTokenMedicine,
    } = this.props.navigation.state.params

    this.setState({ isMeasurementContextModalVisible: false })

    if (!this.didUploadResults) {
      console.log('Uploading result')

      // 服药前: 'BEFORE_TAKING_MEDICINE',
      // 服药后: 'AFTER_TAKING_MEDICINE',
      const medicineContext = isTokenMedicine
        ? 'AFTER_TAKING_MEDICINE'
        : 'BEFORE_TAKING_MEDICINE'
      const mac = await AsyncStorage.getItem(ASYNC_STORAGE_SAVED_MAC_KEY)
      const response = await this.props.mutate({
        variables: {
          systolic,
          diastolic,
          heartRate: pulse,
          measurementDeviceAddress: mac,
          measurementDeviceModel: 'TODO',
          measuredAt: new Date(),
          measurementContext: [
            medicineContext,
            ...this.state.measurementContext,
          ],
          deviceContext: {
            appName: 'TACTFUL_TROUT',
            appVersion: APP_VERSION,
            systemName: 'TODO',
            systemVersion: 'TODO',
          },
        },
      })

      this.didUploadResults = true
    }
  }

  render() {
    const {
      systolic,
      diastolic,
      pulse,
      level,
    } = this.props.navigation.state.params
    return (
      <ExpandingView>
        <Top backgroundColor={level.color}>
          <LCD systolic={systolic} diastolic={diastolic} pulse={pulse} />
          <HistoryButton
            onPress={() =>
              this.props.navigation.navigate('MeasureTrendScreen')}
          >
            <HistoryText>查看测量历史</HistoryText>
          </HistoryButton>
        </Top>
        <Middle>
          <TouchableOpacity
            onPress={() => {
              this.toggleExplanationModal()
            }}
          >
            <BambooRulers position={level.id} />
          </TouchableOpacity>
          <StateOfMeasurement>
            {this.state.measurementContext.map(e => (
              <StateItem key={e}>
                {MEASUREMENT_STATES_ENUM_TO_LABEL[e]}
              </StateItem>
            ))}
          </StateOfMeasurement>
        </Middle>
        <Bottom>
          {this.state.canChat === null ? (
            <ActivityIndicator size="large" color={PRIMARY_COLOR} animating />
          ) : (
              this.state.canChat === true && (
                <ChatButton onPress={this.onChatButtonPress} />
              )
            )}
        </Bottom>
        <LegendModal
          visible={this.state.isExplanationModalVisible}
          onCloseButtonPress={this.toggleExplanationModal}
          onRequestClose={this.toggleExplanationModal}
        />
        <MeasurementContextModal
          visible={this.state.isMeasurementContextModalVisible}
          measurementContext={this.state.measurementContext}
          onUpdateMeasurementContext={measurementContext =>
            this.setState({ measurementContext })}
          dismiss={this.onSubmitTagsPress}
        />
      </ExpandingView>
    )
  }
}

const HistoryButton = styled.TouchableOpacity`
  height: 20;
  width: 100;
  border-width: 1;
  border-color: white;
  border-radius: 10;
  justify-content: center;
  align-items: center;
  margin-top: 20;
`

const HistoryText = styled.Text`
  margin-horizontal: 10;
  font-size: 12;
  color: white;
`

const Top = styled.View`
  align-items: center;
  background-color: ${props => props.backgroundColor};
  justify-content: center;
  flex: 3;
`

const Middle = styled.View`flex: 1;`

const Bottom = styled.View`
  flex: 1;
  justify-content: center;
`

const StateOfMeasurement = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 25;
  padding-left: 40;
  padding-right: 40;
`
const StateItem = styled.Text`
  color: #9e9e9e;
  font-size: 12;
  margin-right: 12;
  margin-bottom: 8;
`
