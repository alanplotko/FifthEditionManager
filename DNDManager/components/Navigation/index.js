import React, { Component } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  ToolbarAndroid,
  View
} from 'react-native';

export default class Navigation extends Component {
  render() {
    return (
      <View>
        <StatusBar
          style={styles.statusBar}
          barStyle='light-content'
          backgroundColor='#1A237E'
        />
        <ToolbarAndroid
          title='DnD Manager'
          titleColor='#fff'
          style={styles.toolbar}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  toolbar: {
    width: '100%',
    height: 56,
    backgroundColor: '#3F51B5'
  },
  statusBar: {
    width: '100%',
    height: 24
  }
});
