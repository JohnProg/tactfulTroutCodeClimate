import * as React from 'react'
import { View, Dimensions, StatusBar, Text } from 'react-native'
import clamp from 'lodash/clamp'
import styled from 'styled-components/native'
import { BLOOD_PRESURE_STANDARD } from '../../../constants'

const WINDOW_WIDTH = Dimensions.get('window').width

export const BambooRulers = ({ position }) => {
  const numberOfSections = BLOOD_PRESURE_STANDARD.length
  const maxIndex = numberOfSections - 1
  position = clamp(position, 0, maxIndex)

  const bubbleAttr = BLOOD_PRESURE_STANDARD[position]

  const sectionWidth = (WINDOW_WIDTH - 80) / numberOfSections - 1

  return (
    <View>
      <BubbleLevel
        bubblePosition={position}
        totalOfSections={numberOfSections}
        sectionWidth={sectionWidth}
      >
        <Arrow color={bubbleAttr.color} />
        <Bubble color={bubbleAttr.color}>
          <BubbleContent color={bubbleAttr.color}>
            {bubbleAttr.text}
          </BubbleContent>
        </Bubble>
      </BubbleLevel>
      <Bamboo>
        {BLOOD_PRESURE_STANDARD.map((sec, index) => {
          const color = sec.color
          return (
            <Section
              key={index}
              color={color}
              maxIndex={maxIndex}
              index={index}
              width={sectionWidth}
            />
          )
        })}
      </Bamboo>
    </View>
  )
}

const Bamboo = styled.View`
  justify-content: center;
  flex-direction: row;
`

const Section = styled.View`
  background-color: ${p => p.color || '#ddd'};
  width: ${p => p.width};
  height: 5;
  margin-left: 1;
  margin-right: 1;
  border-top-left-radius: ${p => (p.index === 0 ? 2 : 0)};
  border-bottom-left-radius: ${p => (p.index === 0 ? 2 : 0)};
  border-top-right-radius: ${p => (p.index === p.maxIndex ? 2 : 0)};
  border-bottom-right-radius: ${p => (p.index === p.maxIndex ? 2 : 0)};
`

const Bubble = styled.View`
  padding-top: 4;
  padding-bottom: 4;
  padding-left: 10;
  padding-right: 10;
  border-radius: 12;
  border-width: 1;
  border-color: ${p => p.color || '#eee'};
  position: absolute;
  bottom: 8;
  justify-content: center;
  background-color: #fff;
`

const BubbleLevel = styled.View`
  height: 60;
  flex-direction: row;
  justify-content: center;
  left: ${p =>
    (p.bubblePosition - (p.totalOfSections - 1) / 2) * (p.sectionWidth + 2)};
`

const BubbleContent = styled.Text`
  text-align: center;
  color: ${p => p.color || '#eee'};
  font-size: 12;
`
const Arrow = styled.View`
  height: 14;
  width: 14;
  transform: rotate(45deg);
  background-color: ${p => p.color || '#eee'};
  position: absolute;
  bottom: 4;
`
