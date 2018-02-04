import { AppLoading, Asset, Font } from 'expo';
import React from 'react';
import { StackNavigator } from 'react-navigation';
import { IMAGES } from 'DNDManager/config/Info';

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
    disabledColor: COLOR.grey300,
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

// Navigation config
const RootNavigator = StackNavigator({
  Home: { screen: HomeScreen },
  CreateCampaign: { screen: CreateCampaignScreen },
  SetUpProfile: { screen: Character.SetUpProfile },
  SetCharacterRace: { screen: Character.SetRace },
  SetCharacterClass: { screen: Character.SetClass },
  SetCharacterBackground: { screen: Character.SetBackground },
  ChooseScoringMethod: { screen: Character.ChooseScoringMethod },
  RollAbilityScores: { screen: Character.RollAbilityScores },
  PointBuyScores: { screen: Character.PointBuyScores },
  AssignAbilityScores: { screen: Character.AssignAbilityScores },
  SetSkills: { screen: Character.SetSkills },
  AssignLanguages: { screen: Character.AssignLanguages },
  ReviewSavingThrows: { screen: Character.ReviewSavingThrows },
  ReviewHitPoints: { screen: Character.ReviewHitPoints },
});

const cacheFonts = fonts => fonts.map(font => Font.loadAsync(font));
const cacheImages = images =>
  images.map(image => Asset.fromModule(image).downloadAsync());

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
    };
  }

  async loadAssetsAsync() {
    const imageAssets = cacheImages([
      ...Object.values(IMAGES.RACE),
      ...Object.values(IMAGES.BASE_CLASS),
    ]);
    const fontAssets = cacheFonts([
      {
        RobotoThin:
          require('DNDManager/assets/fonts/Roboto/Roboto-Thin.ttf'),
      },
      {
        RobotoLight:
          require('DNDManager/assets/fonts/Roboto/Roboto-Light.ttf'),
      },
      {
        RobotoRegular:
          require('DNDManager/assets/fonts/Roboto/Roboto-Regular.ttf'),
      },
      {
        RobotoBold:
          require('DNDManager/assets/fonts/Roboto/Roboto-Bold.ttf'),
      },
    ]);
    await Promise.all([...imageAssets, ...fontAssets]);
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this.loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }
    return <ThemeProvider uiTheme={uiTheme}><RootNavigator /></ThemeProvider>;
  }
}
