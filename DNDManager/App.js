import Expo from 'expo';
import React from 'react';
import { StackNavigator } from 'react-navigation';

// Screens
import HomeScreen from 'DNDManager/screens/HomeScreen';
import CreateCampaignScreen from 'DNDManager/screens/CreateCampaignScreen';
import { CreateCharacterScreen, SetCharacterBackgroundScreen }
  from 'DNDManager/screens/CharacterCreation';

// Font assets
const RobotoThin = require('DNDManager/assets/fonts/Roboto/Roboto-Thin.ttf'),
  RobotoLight = require('DNDManager/assets/fonts/Roboto/Roboto-Light.ttf')
  Roboto = require('DNDManager/assets/fonts/Roboto/Roboto-Regular.ttf'),
  RobotoBold = require('DNDManager/assets/fonts/Roboto/Roboto-Bold.ttf');

// Navigation config
const RootNavigator = StackNavigator({
  // TO DO: revert to HomeScreen after development work
  Home: { screen: SetCharacterBackgroundScreen },//HomeScreen },
  CreateCampaign: { screen: CreateCampaignScreen },
  CreateCharacter: { screen: CreateCharacterScreen },
  SetCharacterBackground: { screen: SetCharacterBackgroundScreen },
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
    await Expo.Font.loadAsync({ RobotoThin, RobotoLight, Roboto, RobotoBold });
    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }
    return <RootNavigator />;
  }
}
