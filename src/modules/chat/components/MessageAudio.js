import PropTypes from 'prop-types'
import React from 'react'
import {
  Linking,
  StyleSheet,
  Text,
  View,
  ViewPropTypes,
  TouchableOpacity,
} from 'react-native'
const Sound = require('react-native-sound')

import ParsedText from 'react-native-parsed-text'
import Communications from 'react-native-communications'

const WWW_URL_PATTERN = /^www\./i

export default class MessageAudio extends React.Component {
  render() {
    console.log(this.props)
    const linkStyle = StyleSheet.flatten([
      styles[this.props.position].link,
      this.props.linkStyle[this.props.position],
    ])
    return (
      <TouchableOpacity
        onPress={() => {
          const sound = new Sound(
            this.props.currentMessage.audioUrl,
            undefined,
            error => {
              if (error) {
                console.log(error)
              } else {
                sound.play(() => {
                  sound.release()
                })
              }
            },
          )
        }}
        style={[
          styles[this.props.position].container,
          this.props.containerStyle[this.props.position],
        ]}
      >
        <Text
          style={[
            styles[this.props.position].text,
            this.props.textStyle[this.props.position],
          ]}
        >
          🔉
        </Text>
      </TouchableOpacity>
    )
  }
}

const textStyle = {
  fontSize: 35,
}

const styles = {
  left: StyleSheet.create({
    container: {
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: 'black',
      ...textStyle,
    },
    link: {
      color: 'black',
      textDecorationLine: 'underline',
    },
  }),
  right: StyleSheet.create({
    container: {
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: 'white',
      ...textStyle,
    },
    link: {
      color: 'white',
      textDecorationLine: 'underline',
    },
  }),
}

MessageAudio.contextTypes = {
  actionSheet: PropTypes.func,
}

MessageAudio.defaultProps = {
  position: 'left',
  currentMessage: {
    text: '',
  },
  containerStyle: {},
  textStyle: {},
  linkStyle: {},
  parsePatterns: () => [],
}

MessageAudio.propTypes = {
  position: PropTypes.oneOf(['left', 'right']),
  currentMessage: PropTypes.object,
  containerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  textStyle: PropTypes.shape({
    left: Text.propTypes.style,
    right: Text.propTypes.style,
  }),
  linkStyle: PropTypes.shape({
    left: Text.propTypes.style,
    right: Text.propTypes.style,
  }),
  parsePatterns: PropTypes.func,
}
