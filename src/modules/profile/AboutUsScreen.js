import * as React from 'react'
import { TouchableOpacity, AsyncStorage, Alert } from 'react-native'
import { ExpandingCenteringView } from 'react-native-jans-common-components'
import styled from 'styled-components/native'

import { ASYNC_STORAGE_ENV_KEY } from '../../constants'

const VERSION = require('../../../package.json').version

export class AboutUsScreen extends React.Component {
  state = { env: null }

  async componentDidMount() {
    let env = await AsyncStorage.getItem(ASYNC_STORAGE_ENV_KEY)
    env = env || 'PRODUCTION'

    this.setState({ env })
  }

  render() {
    return (
      <ExpandingCenteringView>
        <IconImage
          source={require('../../../assets/imgs/profile-company-icon.png')}
        />
        <AboutUsTextLarge>控血压</AboutUsTextLarge>
        <AboutUsTextLarge>客户端版本{VERSION}</AboutUsTextLarge>
        <AboutUsTextSmall>北京爱和健康科技有限公司版权所有</AboutUsTextSmall>
        <AboutUsTextSmall>Copyright 2017</AboutUsTextSmall>
        <AboutUsTextSmall>{this.state.env}</AboutUsTextSmall>
      </ExpandingCenteringView>
    )
  }
}

AboutUsScreen.navigationOptions = { title: '关于我们' }

const IconImage = styled.Image`
  height: 90;
  width: 90;
  margin-bottom: 20;
`

const AboutUsText = styled.Text`margin-bottom: 16;`
const AboutUsTextLarge = styled(AboutUsText)`font-size: 22;`
const AboutUsTextSmall = styled(AboutUsText)`font-size: 15;`
