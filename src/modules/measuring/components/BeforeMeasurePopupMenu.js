import * as React from 'react'
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
  Modal,
} from 'react-native'
import styled from 'styled-components/native'
import {PopupMenuItem} from './PopupMenuItem'

export const BeforeMeasurePopupMenu = ({onMenuLeftPressed,onMenuRightPressed}) =>{

console.log(onMenuLeftPressed);

  return <Modal
    animationType="fade"
    transparent
    onRequestClose={
      ()=>{console.log('....');}
    }
  >
    <RowContainer>
      <MenuTitle>本次测量时是否已服药？</MenuTitle>
      <ColumnContainer>
        <TouchableOpacity
          onPress={onMenuLeftPressed}
          style={{ flex:1, alignItems: 'center',backgroundColor:"transparent",minHeight:200 }}
        >
          <PopupMenuItem
            text='没有'
            imgUrl='../../../../assets/imgs/iconWater.png'
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onMenuRightPressed}
          style={{ flex:1, alignItems: 'center',backgroundColor:'transparent',minHeight:200 }}
        >
          <PopupMenuItem
            text='服药后'
            imgUrl='../../../../assets/imgs/iconWater.png'
          />
      </TouchableOpacity>
      </ColumnContainer>
    </RowContainer>
  </Modal>
}
const RowContainer = styled.View`
  background-color: rgba(0,0,0,0.3);
  flex: 1;
  justify-content: center;
  align-items: center;
`

const ColumnContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const MenuTitle = styled.Text`
  font-size: 20;
  color: #fff;
  margin-bottom: 20;
  margin-top: 20;
`
