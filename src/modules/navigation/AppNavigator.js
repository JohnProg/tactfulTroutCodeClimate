import * as React from 'react'
import { Text } from 'react-native'
import {
  StackNavigator,
  DrawerNavigator,
  TabNavigator,
  TabBarBottom,
} from 'react-navigation'
import {
  ExpandingCenteringView,
  constructStackNavigatorWithDefaultNavigationOptions,
  constructNavigationPlaceholder,
} from 'react-native-jans-common-components'

import { PRIMARY_COLOR } from '../../constants'
import { InitialScreen } from '../initial'
import {
  UserManagementDispatchScreen,
  LogInOrSignUpScreen,
  InfoCompletionScreen,
  TermsOfServiceScreen,
} from '../user-management'
import { MeasuringScreen, MeasuringResultScreen } from '../measuring'
import { ChatScreen, RemindersListScreen } from '../chat'
import {
  ProfileScreen,
  AboutUsScreen,
  ProfileDetailsScreen,
  FeedbackScreen,
} from '../profile'
import { MeasurementHistoryScreen } from '../history'

const TactfulTroutStackNavigator = constructStackNavigatorWithDefaultNavigationOptions(
  {
    headerStyle: { backgroundColor: PRIMARY_COLOR },
    headerTitleStyle: { color: 'white', fontWeight: '300' },
    headerTintColor: 'white',
    headerBackTitleStyle: { color: 'white', fontWeight: '300' },
  },
  { headerMode: 'screen' },
)

const MainTabNavigator = TabNavigator(
  {
    MeasuringScreen: { screen: MeasuringScreen },
    RemindersListScreen: {
      screen: RemindersListScreen,
    },
    ProfileScreen: { screen: ProfileScreen },
  },
  {
    // Enabling this causes the TabNavigator to bug out when the StatusBar is shown
    animationEnabled: false,
    swipeEnabled: false,

    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: PRIMARY_COLOR,
      inactiveTintColor: '#aaa',
      style: { height: 56 },
    },
  },
)

const MainStackNavigator = TactfulTroutStackNavigator({
  MainTabNavigator: { screen: MainTabNavigator },
  ChatScreen: { screen: ChatScreen },
  MeasuringResultScreen: { screen: MeasuringResultScreen },
  ProfileDetailsScreen: { screen: ProfileDetailsScreen },
  AboutUsScreen: { screen: AboutUsScreen },
  FeedbackScreen: { screen: FeedbackScreen },
  MeasurementHistoryScreen: { screen: MeasurementHistoryScreen },
})

const UserManagementStackNavigator = TactfulTroutStackNavigator(
  {
    UserManagementDispatchScreen: { screen: UserManagementDispatchScreen },
    LogInOrSignUpScreen: { screen: LogInOrSignUpScreen },
    InfoCompletionScreen: { screen: InfoCompletionScreen },
    TermsOfServiceScreen: { screen: TermsOfServiceScreen },
  },
  { headerMode: 'none' },
)

export const AppNavigator = TabNavigator(
  {
    InitialScreen: { screen: InitialScreen },
    UserManagementStackNavigator: { screen: UserManagementStackNavigator },
    MainStackNavigator: { screen: MainStackNavigator },
  },
  {
    // Disable animation so that iOS/Android have same behaviors
    animationEnabled: false,
    swipeEnabled: false,

    navigationOptions: {
      tabBarVisible: false,
    },

    backBehavior: 'none',
  },
)
