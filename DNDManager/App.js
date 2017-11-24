import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import CreateScreen from './screens/CreateScreen';

const RootNavigator = StackNavigator({
  Home: { screen: HomeScreen },
  Create: { screen: CreateScreen }
}, {
  navigationOptions: {
    headerTintColor :'#fff',
    headerTitleStyle: {
      color: '#fff'
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
      elevation: 0
    }
  }
});

export default class App extends Component {
  render() {
    return <RootNavigator />;
  }
}
