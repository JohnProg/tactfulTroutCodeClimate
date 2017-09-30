import * as React from 'react'
import {
  View,
  Dimensions,
  Text,
  Image
} from 'react-native'
import styled from 'styled-components/native'

export const PopupMenuItem = ({text,imgUrl}) =>
{

  console.log(imgUrl);

  return <Container>
   <ItemContainer>
     <MenuImage source={require('../../../../assets/imgs/iconWater.png')}/>
     {/* <MenuImage source={require(imgUrl)}/> */}
      <MenuText>{text}</MenuText>
    </ItemContainer>
    </Container>
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
  height: 40;
  width: 30;
  background-color: white;
  align-self: center;
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
