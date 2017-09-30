import * as React from 'react'
import {
  Button,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
  Text,
  ActivityIndicator,
} from 'react-native'
import styled from 'styled-components/native'
import {
  ExpandingCenteringView,
  ExpandingView,
} from 'react-native-jans-common-components'
import { graphql, gql } from 'react-apollo'

import { PRIMARY_COLOR } from '../../../constants'
import { ChatButton } from '../../chat/components'

const query = gql`
  query IsBound {
    me {
      _id
      ... on Patient {
        isBound
      }
    }
  }
`

@graphql(query)
export class RemindersListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: '免费问医',
    header: null,
    tabBarIcon: ({ focused }) =>
      focused ? (
        <Image
          style={{ height: 32, width: 32 }}
          source={require('../../../../assets/imgs/tab-icon-doctor-2.png')}
        />
      ) : (
        <Image
          style={{ height: 32, width: 32 }}
          source={require('../../../../assets/imgs/tab-icon-doctor-1.png')}
        />
      ),
  })

  state = {
    canChat: null,
  }

  componentWillReceiveProps(nextProps) {
    const { me, loading, error } = nextProps.data

    if (me && !loading && !error) {
      this.setState({ canChat: me.isBound })
    }
  }

  onChatButtonPress = () => this.props.navigation.navigate('ChatScreen')

  render() {
    if (this.state.canChat === null) {
      return (
        <ExpandingCenteringView>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} animating />
        </ExpandingCenteringView>
      )
    } else if (this.state.canChat === false) {
      return (
        <ExpandingCenteringView>
          <Text style={{ marginBottom: 20 }}>You can't chat, sorry.</Text>
          <Button
            title="Refresh"
            onPress={() => this.props.data.refetch().catch(() => null)}
          />
        </ExpandingCenteringView>
      )
    } else {
      return (
        <ExpandingView>
          {/*<View style={{ backgroundColor: PRIMARY_COLOR, borderBottomWidth: 0 }}>
          <Text
            style={{
              marginTop: 32,
              fontSize: 18,
              marginBottom: 13,
              color: 'white',
              fontWeight: '300',
              textAlign: 'center',
            }}
          >
            免费问医
          </Text>
        </View>
        <StatusBar hidden={false} />
        <Top></Top>
          <Image
            style={{ height: 48, width: 48 }}
            source={require('../../../../assets/imgs/tab-icon-doctor-3.png')}
          />
          <Text style={{ color: '#fff', marginTop: 10 }}>张某某医生提醒您</Text>
        </Top>
        <Middle>
          <Card>
            <Label>测量</Label>
            <Detail>{'早餐6点-8点间测量一次\n下午5点-7点间测量一次\n您已测量完早晨血压，还需要测量下午血压。'}</Detail>
          </Card>
          <Card>
            <Label>服药</Label>
            <Detail>{'今天应该服药\nXXXXXX 早上 1片\nXXXXXXXX 晚上 2片'}</Detail>
          </Card>
          </Middle>*/}
          <Bottom>
            <Text
              style={{ textAlign: 'center', marginBottom: 10, color: '#666' }}
            >
              问题咨询请点
            </Text>
            <ChatButton onPress={this.onChatButtonPress} />
          </Bottom>
        </ExpandingView>
      )
    }
  }
}

const Top = styled.View`
  background-color: ${props => props.theme.PRIMARY_COLOR};
  justify-content: center;
  align-items: center;
  flex: 0.8;
`

const Middle = styled.View`flex: 2;`

const Bottom = styled.View`
  flex: 1;
  align-items: stretch;
  justify-content: center;
`

const Card = styled.View`
  background-color: #fff;
  margin-bottom: 10;
  padding-top: 20;
  padding-right: 30;
  padding-bottom: 20;
  padding-left: 30;
  flex-direction: row;
`

const Label = styled.Text`
  font-weight: bold;
  font-size: 16;
  color: ${props => props.theme.PRIMARY_COLOR};
  width: 40;
  margin-top: 2;
`

const Detail = styled.Text`
  color: #666;
  font-size: 15;
  line-height: 18;
  margin-right: 30;
`
