import React from 'react'
import { View, Image, Text } from 'react-native'

import { PRIMARY_COLOR } from '../../../constants'

export const ConnectedButtonContent = () => (
  <View style={{ alignItems: 'center' }}>
    <Image
      style={{ height: 100, width: 100 * 200 / 153, marginBottom: 20 }}
      source={require('../../../../assets/imgs/BP3Lbig.png')}
    />
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: PRIMARY_COLOR,
      }}
    >
      <Text
        style={{
          fontSize: 19,
          marginHorizontal: 10,
          color: PRIMARY_COLOR,
        }}
      >
        点击开始测量
      </Text>
    </View>
  </View>
)
