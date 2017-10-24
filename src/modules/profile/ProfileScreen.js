import * as React from 'react'
import {
  Text,
  Image,
  AsyncStorage,
  TouchableOpacity,
  FlatList,
  View,
  StyleSheet,
  NativeModules,
} from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
import {
  ExpandingCenteringView,
  ExpandingView,
} from 'react-native-jans-common-components'
import {
  ASYNC_STORAGE_JWT_KEY,
  PRIMARY_COLOR,
  BACKGROUND_COLOR,
} from '../../constants'
import { RowWithIconAndRightArrow, FlatlistThinSeparator } from './styles'
import get from 'lodash/get'
import { gql, graphql } from 'react-apollo'

const userInfo = gql`
  query Profile {
    me {
      _id
      fullName
      avatar
    }
  }
`
@graphql(userInfo)
export class ProfileScreen extends React.Component {
  state = {
    fullName: null,
    avatarUrl: null,
  }

  componentWillReceiveProps(nextProps) {
    const { me, loading, error } = nextProps.data

    if (!error && !loading && me) {
      const { fullName, avatar } = me
      //the avatar image url is randomly modified so the image is refreshed each time
      avatar = avatar + '?' + Math.random()
      this.setState({
        fullName,
        avatarUrl: avatar,
      })
    }
  }

  static navigationOptions = ({ navigation }) => ({
    title: '我的',
    header: null,
    tabBarIcon: ({ focused }) =>
      focused ? (
        <Image
          style={{ height: 32, width: 32 }}
          source={require('../../../assets/imgs/tab-icon-profile-2.png')}
        />
      ) : (
        <Image
          style={{ height: 32, width: 32 }}
          source={require('../../../assets/imgs/tab-icon-profile-1.png')}
        />
      ),
  })

  onProfileDetailsPress = () => {
    this.props.navigation.navigate('ProfileDetailsScreen', {
      parentRefetch: () => {
        console.log('FETCHING')
        this.props.data.refetch()
      },
    })
  }
  onAboutUsPress = () => {
    this.props.navigation.navigate('AboutUsScreen')
  }

  onFeedbackPress = () => this.props.navigation.navigate('FeedbackScreen')

  onSignOutPress = async () => {
    await AsyncStorage.removeItem(ASYNC_STORAGE_JWT_KEY)
    this.props.navigation.navigate('UserManagementDispatchScreen')
  }

  render() {
    return (
      <ExpandingView>
        <View style={{ backgroundColor: PRIMARY_COLOR, borderBottomWidth: 0 }}>
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
            我的
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => this.onProfileDetailsPress()}
          style={{
            backgroundColor: PRIMARY_COLOR,
            justifyContent: 'center',
            alignItems: 'center',
            height: 150,
            alignItems: 'stretch',
          }}
        >
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Icon style={{ width: 25 }} />
            <Image
              style={{ height: 64, width: 64, borderRadius: 32 }}
              source={{
                uri:
                  this.state.avatarUrl ||
                  'https://png.icons8.com/question-mark-filled/ios7/80',
              }}
            />
            <Icon name="chevron-small-right" size={25} />
          </View>
          <View
            style={{
              marginTop: 22,
              marginBottom: 30,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 18 }}>
              {this.state.fullName || '控血压用户'}
            </Text>
          </View>
        </TouchableOpacity>

        <FlatList
          data={[
            {
              icon: require('../../../assets/imgs/profile-icons-aboutus.png'),
              key: '关于我们',
              onPress: () => {
                this.onAboutUsPress()
              },
            },
            // {
            //   icon: require('../../../assets/imgs/feedback.png'),
            //   key: '意见反馈',
            //   onPress: this.onFeedbackPress,
            // },
            {
              icon: require('../../../assets/imgs/profile-icons-logout.png'),
              key: '退出',
              onPress: () => {
                this.onSignOutPress()
              },
            },
          ]}
          renderItem={({ item }) => (
            <RowWithIconAndRightArrow
              icon={item.icon}
              title={item.key}
              onPress={() => item.onPress()}
            />
          )}
          ItemSeparatorComponent={FlatlistThinSeparator}
        />
      </ExpandingView>
      //   <Text style={{ fontSize: 100 }}>🚧</Text>
    )
  }
}
