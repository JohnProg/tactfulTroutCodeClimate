// import './exceptionHandling'
import * as React from 'react'
import * as wechat from 'react-native-wechat'
import { StatusBar, AsyncStorage, AppState, View, Alert } from 'react-native'
import { BP3LModule } from '@ihealth/ihealthlibrary-react-native'
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

// AppState.addEventListener('change', async state => {
//   if (state !== 'active') {
//     console.log('Changing away from active state')
//     const pairedBP3LMac = await AsyncStorage.getItem(ASYNC_STORAGE_SAVED_MAC_KEY)
//     if (pairedBP3LMac) {
//       console.log(
//         `Disconnecting from ${pairedBP3LMac} before transitioning away from active state...`,
//       )
//       BP3LModule.disconnect(pairedBP3LMac)
//     }
//   }
// })

@codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
})
export class _Root extends React.Component {
  state = {
    apolloClient: null,
  }

  async componentDidMount() {
    wechat.registerApp(WX_APP_ID)

    let networkInterface

    const env = await AsyncStorage.getItem(ASYNC_STORAGE_ENV_KEY)
    if (env === 'PRODUCTION') {
      networkInterface = createNetworkInterface({
        uri: 'https://dodgy-dove.301-prod.ihealthcn.com/graphql',
      })
    } else if (!env || env === 'STAGING') {
      networkInterface = createNetworkInterface({
        //uri: 'https://dodgy-dove.301-play.51ijk.com/graphql',
        uri: 'https://dodgy-dove-stg.ihealthlabs.com.cn/graphql',
      })
    } else if (env === 'LOCAL') {
      networkInterface = createNetworkInterface({
        uri: 'http://localhost:3081/graphql',
      })
    } else {
      Alert.alert('Unknown env', env)
    }

    networkInterface.use([
      {
        async applyMiddleware(req, next) {
          if (!req.options.headers) {
            req.options.headers = {} // Create the header object if needed.
          }

          req.options.headers['client-codename'] = 'TACTFUL_TROUT'

          const jwt = await AsyncStorage.getItem(ASYNC_STORAGE_JWT_KEY)
          if (jwt) {
            req.options.headers.authorization = `Bearer: ${jwt}`
          }

          next()
        },
      },
    ])

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
        networkInterface,
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
