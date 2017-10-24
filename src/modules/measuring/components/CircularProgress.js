import React from 'react'
import { DeviceEventEmitter } from 'react-native'
import {
  BP3LModule,
} from '@ihealth/ihealthlibrary-react-native'
import { AnimatedCircularProgress } from '../../circular-progress'
import { BUTTON_SIZE } from '../common'
export class CircularProgress extends React.Component {
  state = {
    measureProcess: 0,
  }
  componentDidMount() {
    this.addListeners()
  }
  setProcessValue = async event => {
    if (/online_pressure_bp|online_pulsewave_bp/g.test(event.action)) {
      const { pressure } = event
      if((this.state.measureProcess !== pressure) &&
        (pressure - this.state.measureProcess >= 3)
      ) {
        this.setState({
          measureProcess: pressure
        })
      }
    }
  }
  addListeners() {
    this.setProcessValueListener = DeviceEventEmitter.addListener(
      BP3LModule.Event_Notify,
      this.setProcessValue,
    )
  }
  componentWillUnmount() {
    this.setProcessValueListener && this.setProcessValueListener.remove()
  }

  render() {
    const { measureProcess } = this.state
    return <AnimatedCircularProgress
      size={BUTTON_SIZE + 8}
      width={10}
      fill={measureProcess/3}
      tintColor='#50e3c2'
      linecap='round'
      rotation={0}
      backgroundColor='rgba(0, 0, 0, 0)'
      style={{
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 16,
        backgroundColor: 'rgba(0, 0, 0, 0)',
      }}
    />
  }
}
