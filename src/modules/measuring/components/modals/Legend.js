import * as React from 'react'
import { Modal, View, Dimensions } from 'react-native'
import styled from 'styled-components/native'

import { BLOOD_PRESURE_STANDARD } from '../../../../constants'

const windowWidth = Dimensions.get('window').width

export const LegendModal = ({ visible, onCloseButtonPress }) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCloseButtonPress}
    >
      <OuterWrapper>
        <ModalView width={windowWidth - 50}>
          <Top>
            <Title>中国高血压分类标准</Title>
          </Top>
          <Middle>
            {BLOOD_PRESURE_STANDARD.map((sec, index) =>
              <Row key={index}>
                <ColorBlock color={sec.color} />
                <Description>
                  {sec.description}
                </Description>
              </Row>,
            )}
          </Middle>
          <Bottom>
            <Button onPress={onCloseButtonPress}>知道了</Button>
          </Bottom>
        </ModalView>
      </OuterWrapper>
    </Modal>
  )
}

const OuterWrapper = styled.View`
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  flex: 1;
`

const ModalView = styled.View`
  background-color: #fff;
  padding-top: 15;
  padding-right: 15;
  padding-bottom: 15;
  padding-left: 15;
  border-radius: 2;
  width: ${props => props.width};
`
const Top = styled.View`
  justify-content: center;
  align-items: center;
`
const Title = styled.Text`font-size: 14;`

const Middle = styled.View`
  padding-top: 10;
  padding-bottom: 20;
`

const Row = styled.View`
  margin-top: 10;
  flex-direction: row;
  align-items: center;
`

const ColorBlock = styled.View`
  background-color: ${props => props.color};
  width: 10;
  height: 10;
  margin-right: 5;
`
const Description = styled.Text`font-size: 12;`

const Bottom = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  padding-right: 20;
`

const Button = styled.Text`
  padding-top: 5;
  padding-right: 10;
  padding-bottom: 5;
  padding-left: 10;
  font-size: 14;
`
