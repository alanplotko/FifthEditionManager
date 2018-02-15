import { AppLoading, Asset, Font } from 'expo';
import React from 'react';
import { StackNavigator } from 'react-navigation';
import { IMAGES } from 'FifthEditionManager/config/Info';

// Screens
import HomeScreen from 'FifthEditionManager/screens/HomeScreen';
import CreateCampaignScreen from 'FifthEditionManager/screens/CreateCampaignScreen';
import * as Character from 'FifthEditionManager/screens/Character';

// UI theme and styles
import { Button, COLOR, Icon, ThemeProvider } from 'react-native-material-ui';
import { StyleSheet, Text, View } from 'react-native';

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

// Font assets
const RobotoThin = require('FifthEditionManager/assets/fonts/Roboto/Roboto-Thin.ttf');
const RobotoLight = require('FifthEditionManager/assets/fonts/Roboto/Roboto-Light.ttf');
const RobotoRegular =
  require('FifthEditionManager/assets/fonts/Roboto/Roboto-Regular.ttf');
const RobotoBold = require('FifthEditionManager/assets/fonts/Roboto/Roboto-Bold.ttf');

// Navigation config
const RootNavigator = StackNavigator({
  Home: { screen: HomeScreen },
  CreateCampaign: { screen: CreateCampaignScreen },
  SetCharacterRace: { screen: Character.SetRace },
  SetCharacterClass: { screen: Character.SetClass },
  SetCharacterBackground: { screen: Character.SetBackground },
  SetUpProfile: { screen: Character.SetUpProfile },
  ChooseScoringMethod: { screen: Character.ChooseScoringMethod },
  RollAbilityScores: { screen: Character.RollAbilityScores },
  PointBuyScores: { screen: Character.PointBuyScores },
  AssignAbilityScores: { screen: Character.AssignAbilityScores },
  SetSkills: { screen: Character.SetSkills },
  AssignLanguages: { screen: Character.AssignLanguages },
  ReviewSavingThrows: { screen: Character.ReviewSavingThrows },
  ReviewHitPoints: { screen: Character.ReviewHitPoints },
});

const cacheFonts = fonts => Font.loadAsync(fonts);
const cacheImages = images =>
  images.map(image => Asset.fromModule(image).downloadAsync());

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
      error: null,
    };
  }

  loadAssetsAsync = () => {
    const imageAssets = cacheImages([
      ...Object.values(IMAGES.RACE),
      ...Object.values(IMAGES.BASE_CLASS.ICON),
      ...Object.values(IMAGES.BASE_CLASS.BACKDROP),
    ]);
    const fontAssets = cacheFonts({
      RobotoThin, RobotoLight, RobotoRegular, RobotoBold,
    });
    return Promise.all([imageAssets, fontAssets]);
  }

  render() {
    if (this.state.error) {
      return (
        <ThemeProvider uiTheme={uiTheme}>
          <View style={styles.centered}>
            <Icon name="error" style={[styles.messageIcon]} />
            <Text style={styles.heading}>
              We&apos;re having some trouble!
            </Text>
            <Text style={styles.text}>
              We couldn&apos;t load some assets.
            </Text>
            <Text style={styles.text}>
              Try again in a moment.
            </Text>
            <Button
              primary
              raised
              icon="refresh"
              onPress={() => this.setState({ error: null })}
              text="Reload"
              style={{ container: { width: '75%', margin: 20 } }}
            />
          </View>
        </ThemeProvider>
      );
    }
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this.loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={error => this.setState({ error })}
        />
      );
    }
    return <ThemeProvider uiTheme={uiTheme}><RootNavigator /></ThemeProvider>;
  }
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    color: '#666',
    fontSize: 24,
    marginBottom: 10,
  },
  text: {
    color: '#666',
    fontSize: 18,
  },
  messageIcon: {
    color: '#ccc',
    fontSize: 156,
  },
});
