import Expo from 'expo';
import React from 'react';
import { StackNavigator } from 'react-navigation';

// Screens
import HomeScreen from './screens/HomeScreen';
import CreateCampaignScreen from './screens/CreateCampaignScreen';
import CreateCharacterScreen from './screens/CreateCharacterScreen';

// Font assets
const Roboto = require('native-base/Fonts/Roboto.ttf');

// Navigation config
const RootNavigator = StackNavigator({
  Home: { screen: HomeScreen },
  CreateCampaign: { screen: CreateCampaignScreen },
  CreateCharacter: { screen: CreateCharacterScreen },
}, {
  navigationOptions: {
    headerTintColor: '#fff',
    headerTitleStyle: {
      color: '#fff',
    },
    headerStyle: {
      width: '100%',
      height: 56,
      backgroundColor: '#3F51B5',
      shadowOpacity: 0,
      shadowOffset: {
        height: 0,
      },
      shadowRadius: 0,
      elevation: 0,
    },
  },
});

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
    };
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({ Roboto });
    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }
    return <RootNavigator />;
  }
}
