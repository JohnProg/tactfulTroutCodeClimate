import * as React from 'react'
import { View, Dimensions, Text, Image } from 'react-native'
import styled from 'styled-components/native'

export const PopupMenuItem = ({ text, imgName }) => {
  // WTF require中的图片名字必须是一个静态字符串（不能使用变量！因为require是在编译时期执行，而非运行时期执行！）。

  if ('iconPills2x' === imgName) {
    return (
      <Container>
        <ItemContainer>
          <MenuImage
            source={require('../../../../assets/imgs/iconPills2x.png')}
          />
          <MenuText>{text}</MenuText>
        </ItemContainer>
      </Container>
    )
  } else if ('iconWater2x' === imgName) {
    return (
      <Container>
        <ItemContainer>
          <MenuImage
            source={require('../../../../assets/imgs/iconWater2x.png')}
          />
          <MenuText>{text}</MenuText>
        </ItemContainer>
      </Container>
    )
  }
}

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
`

const ItemContainer = styled.View`
  background-color: white;
  flex-direction: column;
  justify-content: center;
  width: 150;
  height: 150;
  border-radius: 150;
  align-self: center;
`

const MenuImage = styled.Image`
  height: 41;
  width: 32;
  background-color: rgba(0, 0, 0, 0);
  align-self: center;
  justify-content: center;
  resize-mode: contain;
`

const MenuText = styled.Text`
  font-size: 16;
  color: #000;
  margin-bottom: 15;
  margin-top: 20;
  text-align: center;
  margin-left: 20;
  margin-right: 20;
`
