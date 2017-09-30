import * as React from 'react'
import { connect } from 'react-redux'
import {
  Text,
  AsyncStorage,
  Button,
  ScrollView,
  NetInfo,
  ActivityIndicator,
} from 'react-native'
import { ExpandingCenteringView } from 'react-native-jans-common-components'
import styled from 'styled-components'
import codePush from 'react-native-code-push'
import { autoUpdateWithTimeout } from 'code-push-update-on-startup'
import nibbana from 'nibbana'

import {
  PRIMARY_COLOR,
  ASYNC_STORAGE_JWT_KEY,
  ASYNC_STORAGE_ENV_KEY,
} from '../../constants'

class InitialScreenComponent extends React.Component {
  state = {
    showSpinner: false,
  }

  async componentDidMount() {
    // await autoUpdateWithTimeout(3000, 5000, () => this.setState({ showSpinner: true }))

    const env = await AsyncStorage.getItem(ASYNC_STORAGE_ENV_KEY)
    if (!env || env === 'PRODUCTION') {
      nibbana.initialize(
        'https://dodgy-dove.301-prod.ihealthcn.com/nibbana',
        'VVytmT2VZZ',
      )
    } else if (env === 'STAGING') {
      nibbana.initialize(
        'https://dodgy-dove.301-play.51ijk.com/nibbana',
        'Pv8xkwnuhB',
      )
    } else if (env === 'LOCAL') {
      nibbana.initialize('http://localhost:3081/nibbana', 'nibnibToken')
    } else {
      Alert.alert('Unknown env', env)
    }

    this.navigateAway()
  }

  navigateAway = async () => {
    // Navigate away
    const jwt = await AsyncStorage.getItem(ASYNC_STORAGE_JWT_KEY)
    if (jwt) {
      this.props.navigation.navigate('MainStackNavigator')
    } else {
      this.props.navigation.navigate('UserManagementStackNavigator')
    }
  }

  render() {
    return (
      <ExpandingCenteringView style={{ backgroundColor: PRIMARY_COLOR }}>
        {this.state.showSpinner && (
          <ActivityIndicator color="white" size="large" animating />
        )}
      </ExpandingCenteringView>
    )
  }
}

export const InitialScreen = InitialScreenComponent
