import React from 'react'
import { View, Text } from 'react-native'

import { PRIMARY_COLOR } from '../../../constants'

export const MeasuringFailedButtonContent = () => (
  <View
    style={{
      flex: 1,
      marginVertical: 20,
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <View style={{ alignItems: 'center' }}>
      <Text style={{ color: 'rgba(255, 82, 0, 1)', fontSize: 25 }}>报错提示</Text>
    </View>
    <View>
      <Text style={{ color: 'rgba(255, 82, 0, 1)' }}>测量失败，请重试一次</Text>
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
      <Text style={{ color: 'white' }}>重新测量</Text>
    </View>
  </View>
)
