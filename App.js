import Expo from 'expo';
import React from 'react';
import { StackNavigator } from 'react-navigation';

// Screens
import HomeScreen from 'DNDManager/screens/HomeScreen';
import CreateCampaignScreen from 'DNDManager/screens/CreateCampaignScreen';
import * as Character from 'DNDManager/screens/Character';

// UI theme
import { COLOR, ThemeProvider } from 'react-native-material-ui';

const uiTheme = {
  palette: {
    primaryColor: COLOR.indigo500,
    accentColor: COLOR.red500,
  },
  toolbar: {
    container: {
      shadowOpacity: 0,
      shadowOffset: {
        height: 0,
      },
      shadowRadius: 0,
      elevation: 0,
    },
  },
};

// Font assets
const RobotoThin = require('DNDManager/assets/fonts/Roboto/Roboto-Thin.ttf');
const RobotoLight = require('DNDManager/assets/fonts/Roboto/Roboto-Light.ttf');
const Roboto = require('DNDManager/assets/fonts/Roboto/Roboto-Regular.ttf');
const RobotoBold = require('DNDManager/assets/fonts/Roboto/Roboto-Bold.ttf');

// Navigation config
const RootNavigator = StackNavigator({
  Home: { screen: HomeScreen },
  CreateCampaign: { screen: CreateCampaignScreen },
  CreateCharacter: { screen: Character.Create },
  SetCharacterRace: { screen: Character.SetRace },
  SetCharacterClass: { screen: Character.SetClass },
  SetCharacterBackground: { screen: Character.SetBackground },
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
    return <ThemeProvider uiTheme={uiTheme}><RootNavigator /></ThemeProvider>;
  }
}
