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

import Echarts from '../../native-echarts';
import SegmentedControlTab from 'react-native-segmented-control-tab'


import Dimensions from 'Dimensions';

import { gql, graphql, withApollo } from 'react-apollo'
import { get, isEqual } from 'lodash'
import moment from 'moment'

const { width } = Dimensions.get('window');

const measurementHistoryQuery = gql`
             query MeasurementHistory($after:Date,$before:Date) {
    me {
      _id
      ... on Patient {
        bloodPressureMeasurements(before:$before,after:$after,limit: 1000) {
          systolic
          diastolic
          heartRate
          measuredAt
        }
      }
    }
  }
`

const beforeDate = moment().endOf('day')._d
let afterDate = moment(beforeDate).subtract(7, 'days')._d
var that = null
@graphql(measurementHistoryQuery, { options: { variables: { before: beforeDate, after: afterDate }, fetchPolicy: 'network-only' } })
export class MeasurementTendencyScreen extends Component {

  state = {
    sysArr: [],
    diaArr: [],
    selectedIndex: 0,
    measureTimes: 0, //测试次数
    avgSysTimes: 0,  //平均高压
    avgDiaTimes: 0,  //平均低压
    overSysTimes: 0, //高压超标次数
    overDiaTimes: 0,  //低压超标次数
  }

  componentWillReceiveProps(nextProps) {

    const { data } = nextProps



    if (!isEqual(data, this.props.data) && !data.loading) {

      const data = get(nextProps, 'data.me.bloodPressureMeasurements', [])

      const measureTimes = data.length

      const dataWithKeys = data.map((v, i) => ({ ...v, key: i }))

      if (dataWithKeys.length > 0) {
        //构建收缩压和舒张压数组
        var _sysArr = []
        var _disArr = []
        for (i = 0; i < dataWithKeys.length; i++) {
          _sysArr.push(dataWithKeys[i].systolic)
          _disArr.push(dataWithKeys[i].diastolic)
        }

        //平均高压
        var avgSysTimes = 0
        var totalSys = 0
        var overSysTimes = 0
        for (var i = 0; i < _sysArr.length; i++) {
          if (_sysArr[i] > 135 || _sysArr[i] < 90) {
            overSysTimes += 1
          }
          totalSys += _sysArr[i]
        }
        avgSysTimes = parseInt(totalSys / _sysArr.length)

        //平均低压
        var avgDiaTimes = 0
        var totalDia = 0
        var overDiaTImes = 0
        for (var i = 0; i < _disArr.length; i++) {
          if (_disArr[i] < 60 || _disArr[i] > 85) {
            overDiaTImes += 1
          }
          totalDia += _disArr[i]
        }
        avgDiaTimes = parseInt(totalDia / _disArr.length)


        this.setState({
          sysArr: _sysArr,
          diaArr: _disArr,
          measureTimes: measureTimes, //测量次数
          avgSysTimes: avgSysTimes,  //平均高压
          avgDiaTimes: avgDiaTimes,  //平均低压
          overSysTimes: overSysTimes, //高压超标次数
          overDiaTimes: overDiaTImes  //低压超标次数
        })
      } else {
        this.setState({
          sysArr: [],
          diaArr: [],
          selectedIndex: 0,
          measureTimes: 0, //测试次数
          avgSysTimes: 0,  //平均高压
          avgDiaTimes: 0,  //平均低压
          overSysTimes: 0, //高压超标次数
          overDiaTimes: 0  //低压超标次数
        })
      }
    }
  }

  _onChange = (index) => {

    let thisSelectedIndex = index
    switch (thisSelectedIndex) {
      case 0:
        //7天
        afterDate = moment(beforeDate).subtract(7, 'days')._d
        break;
      case 1:
        //一个月
        afterDate = moment(beforeDate).subtract(1, 'months')._d
        break;
      case 2:
        //三个月
        afterDate = moment(beforeDate).subtract(3, 'months')._d
        break;
      case 3:
        //全部
        afterDate = moment(beforeDate).subtract(100, 'years')._d
        break;
      default:
        break
    }
    this.setState({
      selectedIndex: index
    })
    this.props.data.refetch({ after: afterDate })
  }
  initOptions = () => {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        }
      },
      //可以手动选择显示几个图标
      legend: {
        data: ['收缩压', '舒张压'],
        y: "bottom"
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: []
        }
      ],
      yAxis: [
        {
          type: 'value',
          data: [0, 40, 60, 80, 100, 120, 140],
          min: '0',
          max: '200',
          splitNumber: '5',
          axisLabel: {
            fontSize: '50'
          }
        }
      ],
      series: [
        {
          name: '收缩压',//gaoya
          type: 'line',
          areaStyle: { normal: { color: 'lightblue' } },
          data: this.state.sysArr,
          itemStyle: {
            normal: {
              color: 'lightblue',
              lineStyle: {
                color: 'lightblue',
                width: '3'
              }

            }
          },
          symbolSize: '7'
        },
        {
          name: '舒张压',
          type: 'line',
          areaStyle: { normal: { color: 'rgb(229,251,185)' } },
          data: this.state.diaArr,
          itemStyle: {
            normal: {
              color: 'khaki',
              lineStyle: {
                color: 'rgb(210,238,146)',
                width: '3'

              }
            }
          },
          symbolSize: '7'
        }
      ]
    };
    return option
  }

  render() {
    that = this
    return (
      <View style={styles.container}>
        <View style={styles.splitView}>
          <SegmentedControlTab tabTextStyle={styles.tabTextStyle} tabStyle={styles.tabStyle} activeTabStyle={styles.activeTabStyle} values={['最近7天', '最近1月', '最近3月', '全部']}
            selectedIndex={this.state.selectedIndex} onTabPress={this._onChange} />
        </View>
        <Echarts option={this.initOptions()} height={250} width={width} />

        <View style={{ backgroundColor: 'white', height: 300 }}>
          <View style={[{ flexDirection: 'row' }, { height: 70 }, { marginTop: 30, marginLeft: 30 }]}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={styles.fontText} >{this.state.measureTimes}次</Text>

              <Text style={styles.smallFontText} >测试次数</Text>
            </View>
            <View style={[{ flex: 1, flexDirection: 'row' }, { marginRight: 40 }]}>
              <Text style={styles.fontText}>{this.state.avgSysTimes}/{this.state.avgDiaTimes}</Text>

              <Text style={styles.smallFontText}>平均血压</Text>
            </View>

          </View>

          <View style={[{ flexDirection: 'row' }, { height: 70 }, { marginLeft: 30 }]}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={styles.fontText} >{this.state.overSysTimes}次</Text>

              <Text style={styles.smallFontText} >高压超标</Text>
            </View>
            <View style={[{ flex: 1, flexDirection: 'row' }, { marginRight: 40 }]}>
              <Text style={styles.fontText}>{this.state.overDiaTimes}次</Text>

              <Text style={styles.smallFontText}>低压超标</Text>
            </View>

          </View>
        </View>
      </View>


    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  splitView: {
    // height: Platform.OS == 'ios' ? 60 : 60,
    paddingTop: Platform.OS == 'ios' ? 25 : 30,
    paddingLeft: Platform.OS == 'ios' ? 20 : 30,
    paddingRight: Platform.OS == 'ios' ? 20 : 30,
    backgroundColor: 'white',
  },
  fontText: {
    fontSize: 32,
    color: 'rgb(0,190,148)',
    fontWeight: 'bold',
  },
  smallFontText: {
    color: 'rgb(157,158,159)',
    marginLeft: 5,
    marginTop: 20,
    fontSize: 13,

  },
  tabTextStyle: {
    color: 'rgb(116,117,118)',

  },
  activeTabStyle: {
    backgroundColor: 'rgb(116,117,118)',
  },
  tabStyle: {
    borderColor: 'rgb(116,117,118)',
  }


});
