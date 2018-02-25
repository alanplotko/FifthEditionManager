import { AppLoading, Asset, Font } from 'expo';
import React from 'react';
import { StackNavigator } from 'react-navigation';

// Assets
import { IMAGES } from 'FifthEditionManager/config/Info';

// Screens
import { HomeScreen } from 'FifthEditionManager/screens/HomeScreen';
import * as CharacterBuild from 'FifthEditionManager/screens/Character/Create';

// UI theme and styles
import { Button, COLOR, Icon, ThemeProvider } from 'react-native-material-ui';
import { StyleSheet, Text, View } from 'react-native';
import DefaultTheme from 'FifthEditionManager/themes/DefaultTheme';

// Font assets
const RobotoThin = require('FifthEditionManager/assets/fonts/Roboto/Roboto-Thin.ttf');
const RobotoLight = require('FifthEditionManager/assets/fonts/Roboto/Roboto-Light.ttf');
const RobotoRegular =
  require('FifthEditionManager/assets/fonts/Roboto/Roboto-Regular.ttf');
const RobotoBold = require('FifthEditionManager/assets/fonts/Roboto/Roboto-Bold.ttf');

// Navigation config
const RootNavigator = StackNavigator({
  Home: { screen: HomeScreen },
  SetCharacterRace: { screen: CharacterBuild.CharacterRace },
  SetCharacterClass: { screen: CharacterBuild.CharacterBaseClass },
  SetCharacterBackground: { screen: CharacterBuild.CharacterBackground },
  SetUpProfile: { screen: CharacterBuild.CharacterProfile },
  ChooseScoringMethod: { screen: CharacterBuild.ScoringMethod },
  RollAbilityScores: { screen: CharacterBuild.RollScores },
  PointBuyScores: { screen: CharacterBuild.PointBuyScores },
  AssignAbilityScores: { screen: CharacterBuild.AbilityScores },
  SetSkills: { screen: CharacterBuild.Skills },
  AssignLanguages: { screen: CharacterBuild.Languages },
  ReviewSavingThrows: { screen: CharacterBuild.SavingThrows },
  ReviewHitPoints: { screen: CharacterBuild.HitPoints },
});

const cacheFonts = fonts => Font.loadAsync(fonts);
const cacheImages = images =>
  images.map(image => Asset.fromModule(image).downloadAsync());

// Styles
const messageIconStyle = { fontSize: 156, color: COLOR.grey400 };

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
    // Theme setup
    const { fadedTextColor, backdropIconColor } = DefaultTheme.palette;
    const fadedTextStyle = { color: fadedTextColor };
    messageIconStyle.color = backdropIconColor;

    if (this.state.error) {
      return (
        <ThemeProvider uiTheme={DefaultTheme}>
          <View style={styles.centered}>
            <Icon name="error" style={messageIconStyle} />
            <Text style={[styles.heading, fadedTextStyle]}>
              We&apos;re having some trouble!
            </Text>
            <Text style={[styles.text, fadedTextStyle]}>
              We couldn&apos;t load some assets.
            </Text>
            <Text style={[styles.text, fadedTextStyle]}>
              Try again in a moment.
            </Text>
            <Button
              primary
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
    return <ThemeProvider uiTheme={DefaultTheme}><RootNavigator /></ThemeProvider>;
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
    fontSize: 24,
    paddingBottom: 10,
    color: COLOR.grey700,
  },
  text: {
    fontSize: 18,
    color: COLOR.grey700,
  },
});
