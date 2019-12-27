import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';

import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// Assets
import { IMAGES } from 'FifthEditionManager/config/Info';

// Screens
import { HomeScreen } from 'FifthEditionManager/screens/HomeScreen';
import * as CharacterBuild from 'FifthEditionManager/screens/Character/Create';

// UI theme and styles
import { Button, COLOR, Icon, ThemeContext, getTheme } from 'react-native-material-ui';
import { StyleSheet, Text, View, YellowBox } from 'react-native';
import DefaultTheme from 'FifthEditionManager/themes/DefaultTheme';

// Font assets
const RobotoThin = require('FifthEditionManager/assets/fonts/Roboto/Roboto-Thin.ttf');
const RobotoLight = require('FifthEditionManager/assets/fonts/Roboto/Roboto-Light.ttf');
const RobotoRegular =
  require('FifthEditionManager/assets/fonts/Roboto/Roboto-Regular.ttf');
const RobotoBold = require('FifthEditionManager/assets/fonts/Roboto/Roboto-Bold.ttf');

// Navigation config
const RootNavigator = createStackNavigator({
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
  ReviewHitPoints: { screen: CharacterBuild.HitPoints },
});
const AppContainer = createAppContainer(RootNavigator);

const cacheFonts = fonts => Font.loadAsync(fonts);
const cacheImages = images =>
  images.map(image => Asset.fromModule(image).downloadAsync());

/*
  Suppress warnings until react-native-material-ui is updated to support latest
  changes where some lifecycle methods are now deprecated.
*/
YellowBox.ignoreWarnings([
  'Warning: componentWillReceiveProps has been renamed',
  'Warning: componentWillUpdate has been renamed',
]);

export default class App extends React.Component {
  static loadAssetsAsync() {
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

  constructor() {
    super();
    this.state = {
      isReady: false,
      error: null,
    };
  }

  render() {
    if (this.state.error) {
      return (
        <ThemeContext.Consumer>
          {theme => (
            <View style={styles.centered}>
              <Icon name="error" size={156} color={theme.palette.backdropIconColor} />
              <Text
                style={[styles.heading, { color: theme.palette.fadedTextColor }]}
              >
                We&apos;re having some trouble!
              </Text>
              <Text style={[styles.text, { color: theme.palette.fadedTextColor }]}>
                We couldn&apos;t load some assets.
              </Text>
              <Text style={[styles.text, { color: theme.palette.fadedTextColor }]}>
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
          )}
        </ThemeContext.Consumer>
      );
    }
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={App.loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={error => this.setState({ error })}
        />
      );
    }
    return (
      <ThemeContext.Provider value={getTheme(DefaultTheme)}>
        <AppContainer />
      </ThemeContext.Provider>
    );
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
