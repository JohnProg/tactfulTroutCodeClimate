import * as React from 'react'
import {
  Modal,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
import styled from 'styled-components/native'

export const DiscoveringModal = ({
  visible,
  discoveredMacs,
  cancelDiscover,
  connect,
}) =>
  <Modal
    animationType="fade"
    transparent
    onRequestClose={cancelDiscover}
    visible={visible}
  >
    <Container>
      <MacList>
        <MacContainer>
          {discoveredMacs.map((mac, i) =>
            <MacButton
              onPress={() => {
                cancelDiscover()
                connect(mac)
              }}
              key={i}
            >
              <MacText>
                {mac}
              </MacText>
              <Icon name="chevron-small-right" size={25} color="white" />
            </MacButton>,
          )}
          <Spinner size="large" animating color="white" />
        </MacContainer>
      </MacList>
      <CancelButton onPress={cancelDiscover}>
        <CancelText>取消</CancelText>
      </CancelButton>
    </Container>
  </Modal>

const Container = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.75);
`

const MacList = styled.ScrollView`flex: 1;`
const MacContainer = styled.View`margin: 20px;`
const Spinner = styled.ActivityIndicator`margin-top: 20;`
const MacButton = styled.TouchableOpacity`
  margin-bottom: 20;
  flex-direction: row;
  justify-content: space-between;
`
const MacText = styled.Text`
  color: white;
  font-size: 20;
  font-weight: bold;
`

const CancelButton = styled.TouchableOpacity`
  flex-direction: column;
  align-self: stretch;
  align-items: center;
`

const CancelText = styled.Text`
  color: white;
  font-size: 25;
  padding: 20px;
`
