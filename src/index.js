// import './exceptionHandling'
import * as React from 'react'
import * as wechat from 'react-native-wechat'
import { StatusBar, AsyncStorage, AppState, View, Alert } from 'react-native'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { ExpandingView } from 'react-native-jans-common-components'
import codePush from 'react-native-code-push'
import {
  ApolloProvider,
  createNetworkInterface,
  ApolloClient,
  IntrospectionFragmentMatcher,
} from 'react-apollo'
import {
  SubscriptionClient,
  addGraphQLSubscriptions,
} from 'subscriptions-transport-ws'
const Sound = require('react-native-sound')

import './exceptionHandler'
import { AppNavigator } from './modules/navigation/'
import { ThemeProvider } from 'styled-components'
import {
  THEME,
  PRIMARY_COLOR,
  ASYNC_STORAGE_JWT_KEY,
  ASYNC_STORAGE_SAVED_MAC_KEY,
  ASYNC_STORAGE_ENV_KEY,
  WX_APP_ID,
} from './constants'

// @codePush({
//   checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
//   installMode: codePush.InstallMode.ON_NEXT_RESUME,
// })

export class _Root extends React.Component {
  state = {
    apolloClient: null,
  }

  async componentDidMount() {
    wechat.registerApp(WX_APP_ID)

    let networkInterface

    const env = await AsyncStorage.getItem(ASYNC_STORAGE_ENV_KEY)
    let wsUri = ''
    if (env === 'STAGING') {
      networkInterface = createNetworkInterface({
        // uri: 'https://dodgy-dove.301-play.51ijk.com/graphql',
        uri: 'https://dodgy-dove-stg.ihealthlabs.com.cn/graphql',
      })
      wsUri = 'wss://dodgy-dove-stg.ihealthlabs.com.cn/feedback'
    } else if (env === 'LOCAL') {
      networkInterface = createNetworkInterface({
        uri: 'http://localhost:3081/graphql',
      })
      wsUri = 'ws://localhost:3081/feedback'
    } else {
      networkInterface = createNetworkInterface({
        uri: 'https://dodgy-dove.301-prod.ihealthcn.com/graphql',
      })
      wsUri = 'wss://dodgy-dove.301-prod.ihealthcn.com/feedback'
    }
    networkInterface.use([
      {
        async applyMiddleware(req, next) {
          if (!req.options.headers) {
            req.options.headers = {} // Create the header object if needed.
          }
          const jwtInSide = await AsyncStorage.getItem(ASYNC_STORAGE_JWT_KEY)
          // console.log('jwt: ', jwtInSide)
          req.options.headers['client-codename'] = 'TACTFUL_TROUT'
          if (jwtInSide) {
            req.options.headers.authorization = `Bearer: ${jwtInSide}`
          }

          next()
        },
      },
    ])
    const jwt = await AsyncStorage.getItem(ASYNC_STORAGE_JWT_KEY)
    const subscriptionClient = new SubscriptionClient(wsUri, {
      reconnect: true,
      connectionParams: {
        token: jwt ? `Bearer: ${jwt}` : null,
      },
    })
    const networkInterfaceWithPubSub = addGraphQLSubscriptions(
      networkInterface,
      subscriptionClient,
    )
    const fragmentMatcher = new IntrospectionFragmentMatcher({
      introspectionQueryResultData: {
        __schema: {
          types: [
            {
              kind: 'INTERFACE',
              name: 'ChatMessage',
              possibleTypes: [
                { name: 'AudioMessage' },
                { name: 'TextMessage' },
                { name: 'ImageMessage' },
              ],
            },
          ],
        },
      },
    })

    this.setState({
      apolloClient: new ApolloClient({
        networkInterface: networkInterfaceWithPubSub,
        fragmentMatcher,
      }),
    })
  }

  render() {
    return this.state.apolloClient ? (
      <ApolloProvider client={this.state.apolloClient}>
        <ThemeProvider theme={THEME}>
          <ExpandingView>
            <StatusBar
              barStyle="light-content"
              backgroundColor={PRIMARY_COLOR}
            />
            <AppNavigator />
          </ExpandingView>
        </ThemeProvider>
      </ApolloProvider>
    ) : (
      <View />
    )
  }
}

export default _Root

/*
device: {
        isEmulator: DeviceInfo.isEmulator(),
        brand: DeviceInfo.getBrand(),
        buildNumber: DeviceInfo.getBuildNumber(),
        bundleId: DeviceInfo.getBundleId(),
        deviceCountry: DeviceInfo.getDeviceCountry(),
        deviceId: DeviceInfo.getDeviceId(),
        deviceLocale: DeviceInfo.getDeviceLocale(),
        manufacturer: DeviceInfo.getManufacturer(),
        model: DeviceInfo.getModel(),
        readableVersion: DeviceInfo.getReadableVersion(),
        systemName: DeviceInfo.getSystemName(),
        systemVersion: DeviceInfo.getSystemVersion(),
        timezone: DeviceInfo.getTimezone(),
        uniqueID: DeviceInfo.getUniqueID(),
        userAgent: DeviceInfo.getUserAgent(),
        appVersion: DeviceInfo.getVersion(),
        isTablet: DeviceInfo.isTablet(),
      },
      */
