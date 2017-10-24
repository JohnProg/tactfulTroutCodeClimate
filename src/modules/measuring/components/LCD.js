import * as React from 'react'
import { View, Text, Platform } from 'react-native'
import styled from 'styled-components/native'

export const LCD = ({ systolic, diastolic, pulse }) => (
  <View>
    <ResultItem name="systolic" value={systolic} />
    <ResultItem name="diastolic" value={diastolic} />
    <ResultItem name="pulse" value={pulse} />
  </View>
)

const itemsConfig = {
  systolic: { name: '高压', unit: 'mmHg' },
  diastolic: { name: '低压', unit: 'mmHg' },
  pulse: { name: '脉搏', unit: 'BPM' },
}

const ResultItem = ({ name, value }) => {
  const itemConf = itemsConfig[name]

  if (!itemConf) return null

  return (
    <ItemWrapper>
      <ItemLabel>
        <ItemName>{itemConf.name}</ItemName>
        <ItemUnit>{itemConf.unit}</ItemUnit>
      </ItemLabel>
      <View>
        <ItemValue>{value}</ItemValue>
      </View>
    </ItemWrapper>
  )
}

const ItemName = styled.Text`
  color: #fff;
  font-size: 20;
`

const ItemUnit = styled.Text`
  color: #fff;
  margin-top: 5;
  font-size: 16;
`

const ItemValue = styled.Text`
  color: #fff;
  font-size: 80;
  width: 160;
  font-family: ${Platform.OS === 'ios' ? 'DS-Digital' : 'ds_digit'};
  ${Platform.OS === 'ios' ? `font-weight: bold; font-style: italic;` : ''};
`

const ItemLabel = styled.View`
  width: 70;
  padding-top: 18;
  align-content: flex-start;
  flex-direction: column;
`
const ItemWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
`
