import React from 'react'
import { View, Text, Image } from 'react-native'

import { PRIMARY_COLOR } from '../../../constants'

export const FirstErrorButtonContent = () =>
  <View
    style={{
      flex: 1,
      marginVertical: 20,
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <View style={{ alignItems: 'center' }}>
      <Text style={{ color: 'rgba(255, 82, 0, 1)', fontSize: 25 }}>连接失败</Text>
      <Text style={{ color: 'rgba(255, 82, 0, 1)' }}>建议如下操作</Text>
    </View>
    <View>
      <Text style={{ color: 'rgba(255, 82, 0, 1)' }}>1、按下血压计复位键（箭头所指）</Text>
      <Text style={{ color: 'rgba(255, 82, 0, 1)' }}>2、再点APP里的重新连接按钮</Text>
    </View>
    <Image
      resizeMode="contain"
      style={{ height: 70 }}
      source={require('../../../../assets/imgs/bp3l-arrow.png')}
    />
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 40,
        borderRadius: 20,
        backgroundColor: PRIMARY_COLOR,
      }}
    >
      <Text style={{ color: 'white' }}>重新连接</Text>
    </View>
  </View>

export const SubsequentErrorsButtonContent = () =>
  <View
    style={{
      flex: 1,
      marginVertical: 20,
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <View style={{ alignItems: 'center' }}>
      <Text style={{ color: 'rgba(255, 82, 0, 1)', fontSize: 25 }}>连接失败</Text>
      <Text style={{ color: 'rgba(255, 82, 0, 1)' }}>建议如下操作</Text>
    </View>
    <View>
      <Text style={{ color: 'rgba(255, 82, 0, 1)' }}>1、把手机蓝牙重新开关一次</Text>
      <Text style={{ color: 'rgba(255, 82, 0, 1)' }}>2、按一下血压计的复位键再试</Text>
      <Text style={{ color: 'rgba(255, 82, 0, 1)' }}>3、确认血压计是否有电</Text>
    </View>
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 40,
        borderRadius: 20,
        backgroundColor: PRIMARY_COLOR,
      }}
    >
      <Text style={{ color: 'white' }}>重新连接</Text>
    </View>
  </View>
