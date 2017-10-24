import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Platform,
  SegmentedControlIOS,
  TouchableOpacity,
  Button,
} from 'react-native';

import { MeasurementHistoryScreen } from '../../history'

import { MeasurementTendencyScreen } from '../../tendency'

import EntypoIcon from 'react-native-vector-icons/Entypo'

import Dimensions from 'Dimensions';
const { width } = Dimensions.get('window');
const underlineWidth = (width / 2 - 60) / 2

import ScrollableTabView, { DefaultTabBar } from "react-native-scrollable-tab-view";

export class MeasureTrendScreen extends Component {

  static navigationOptions = {
    // title: '首页',
    header: null,
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollableTabView
          style={{ backgroundColor: 'hsl(0, 0%, 97%)' }}
          renderTabBar={() => <DefaultTabBar
            style={{
              backgroundColor: 'rgb(0,191,148)',
              height: 65
            }}
            tabStyle={{ paddingTop: 25 }}
            underlineStyle={{ backgroundColor: '#fff', height: 2, width: 60, left: underlineWidth }}
          />}
          tabBarActiveTextColor='white'
          tabBarInactiveTextColor='white'
        >
          <MeasurementHistoryScreen tabLabel='测量历史' {...this.props} />
          <MeasurementTendencyScreen tabLabel='趋势统计' {...this.props} />
        </ScrollableTabView>
        <View style={{ position: 'absolute', top: 15, left: 6 }}>
          <TouchableOpacity
            style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.goBack()}>
            <EntypoIcon
              style={{ backgroundColor: 'transparent', marginTop: 15 }}
              name="chevron-thin-left"
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View >)
  }
}
