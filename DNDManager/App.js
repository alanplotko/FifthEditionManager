import Expo from 'expo';
import React from 'react';
import { StackNavigator } from 'react-navigation';

// Screens
import HomeScreen from 'DNDManager/screens/HomeScreen';
import CreateCampaignScreen from 'DNDManager/screens/CreateCampaignScreen';
import * as CharacterCreation from 'DNDManager/screens/CharacterCreation';

// Font assets
const RobotoThin = require('DNDManager/assets/fonts/Roboto/Roboto-Thin.ttf');
const RobotoLight = require('DNDManager/assets/fonts/Roboto/Roboto-Light.ttf');
const Roboto = require('DNDManager/assets/fonts/Roboto/Roboto-Regular.ttf');
const RobotoBold = require('DNDManager/assets/fonts/Roboto/Roboto-Bold.ttf');

// Navigation config
const RootNavigator = StackNavigator({
  Home: { screen: HomeScreen },
  CreateCampaign: { screen: CreateCampaignScreen },
  CreateCharacter: { screen: CharacterCreation.CreateCharacterScreen },
  SetCharacterRace: { screen: CharacterCreation.SetCharacterRace },
  SetCharacterClass: { screen: CharacterCreation.SetCharacterClass },
  SetCharacterBackground: { screen: CharacterCreation.SetCharacterBackground },
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
    await Expo.Font.loadAsync({
      RobotoThin,
      RobotoLight,
      Roboto,
      RobotoBold,
    });
    this.setState({
      isReady: true,
    });
  }

  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }
    return <RootNavigator />;
  }
}
