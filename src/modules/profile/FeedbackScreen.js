import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  Alert,
} from 'react-native'
import styled from 'styled-components/native'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import { gql, graphql } from 'react-apollo'

import { PRIMARY_COLOR } from '../../constants'

const submitFeedbackMutation = gql`
  mutation SubmitFeedback($feedback: String!) {
    submitFeedback(feedback: $feedback)
  }
`

@graphql(submitFeedbackMutation)
export class FeedbackScreen extends Component {
  static navigationOptions = { header: null }

  state = { text: '' }

  onSubmitPress = () => {
    this.props
      .mutate({ variables: { feedback: this.state.text } })
      .catch(() => null)
    this.props.navigation.goBack()
    Alert.alert('Thanks!', 'Thank you for your feedback.')
  }

  render() {
    return (
      <Container>
        <Navbar>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={{
              paddingLeft: 15,
              width: 100,
              justifyContent: 'center',
            }}
          >
            <EntypoIcon
              style={{ backgroundColor: 'transparent', marginTop: 3 }}
              name="chevron-thin-left"
              size={24}
              color="white"
            />
          </TouchableOpacity>
          <View style={{ justifyContent: 'center' }}>
            <Text
              style={{
                color: 'white',
                fontSize: Platform.OS === 'ios' ? 17 : 20,
              }}
            >
              意见反馈
            </Text>
          </View>
          <View style={{ width: 100 }} />
        </Navbar>
        <TextInput
          style={{
            backgroundColor: 'white',
            flex: 1,
            marginHorizontal: 20,
            marginBottom: 20,
            padding: 20,
            paddingTop: 20,
            paddingBottom: 20,
            textAlignVertical: 'top',
          }}
          underlineColorAndroid="transparent"
          autoCapitalize="sentences"
          autoCorrect
          autoFocus
          multiline
          selectionColor={PRIMARY_COLOR}
          value={this.state.text}
          textBreakStrategy="highQuality"
          onChangeText={text => this.setState({ text })}
          placeholder="感谢您的反馈"
          placeholderTextColor="gray"
        />
        <TouchableOpacity
          onPress={this.onSubmitPress}
          style={{
            alignSelf: 'center',
            height: 50,
            marginBottom: 20,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            width: Dimensions.get('window').width - 40,
          }}
        >
          <Text style={{ color: PRIMARY_COLOR, fontSize: 19 }}>提交</Text>
        </TouchableOpacity>
      </Container>
    )
  }
}

const Container = styled.View`
  background-color: ${PRIMARY_COLOR};
  align-items: stretch;
  flex: 1;
`

const Navbar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  height: 44;
  margin-top: ${Platform.OS === 'ios' ? 20 : 0};
  margin-bottom: 10;
`
