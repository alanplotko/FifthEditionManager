import React, { Component } from 'react';
import { Image, View } from 'react-native';

export default class Loader extends Component {
  render() {
    return (
      <View>
        <Image
          style={{ width: 64, height: 64 }}
          source={require('./loading.gif')}
        />
      </View>
    );
  }
}
