import React from 'react'
import { Modal } from 'react-native'
import styled from 'styled-components/native'

import { CheckBoxes } from '..'
import { PRIMARY_COLOR } from '../../../../constants'

import MEASUREMENT_STATES from '../../measurementStates'

const MEASUREMENT_STATE_LABELS = Object.keys(MEASUREMENT_STATES).slice(2)

export class MeasurementContextModal extends React.Component {
  onCheckBoxPress = (i, labelText, didSelect) => {
    const currentContext = this.props.measurementContext
    let newContext
    if (didSelect) {
      newContext = Array.from(
        new Set([...currentContext, MEASUREMENT_STATES[labelText]]),
      )
    } else {
      newContext = currentContext.filter(
        s => s !== MEASUREMENT_STATES[labelText],
      )
    }
    this.props.onUpdateMeasurementContext(newContext)
  }

  getSelectedCheckBoxIndices = () =>
    MEASUREMENT_STATE_LABELS.map(
      (l, i) =>
        this.props.measurementContext.includes(MEASUREMENT_STATES[l])
          ? i
          : null,
    ).filter(i => i !== null)

  render() {
    const {
      visible,
      dismiss,
      measurementContext,
      onUpdateMeasurementContext,
    } = this.props

    return (
      <Modal visible={visible} onRequestClose={dismiss}>
        <Container>
          <InstructionsLarge>请选择本次测量时的状态，再查看测量结果</InstructionsLarge>
          <InstructionsSmall>（以下因素影响血压变化，可多选）</InstructionsSmall>
          <CheckBoxes
            onButtonPress={this.onCheckBoxPress}
            labels={MEASUREMENT_STATE_LABELS}
            selectedIndices={this.getSelectedCheckBoxIndices()}
          />
          <ShowResultButton onPress={dismiss}>
            <ShowResultButtonText>看测量结果</ShowResultButtonText>
          </ShowResultButton>
        </Container>
      </Modal>
    )
  }
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`

const InstructionsLarge = styled.Text`
  font-size: 22;
  font-weight: bold;
  margin-bottom: 20;
  text-align: center;
`

const InstructionsSmall = styled.Text`
  margin-bottom: 20;
  text-align: center;
`

const ShowResultButton = styled.TouchableOpacity`
  margin-top: 20;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  height: 60;
  border-radius: 2;
  background-color: ${PRIMARY_COLOR};
`

const ShowResultButtonText = styled.Text`
  font-size: 20;
  color: white;
`
