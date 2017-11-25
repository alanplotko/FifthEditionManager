import React, { Component } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Container, Text, View }
  from 'native-base';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';

export default class CreateScreen extends Component {
  static navigationOptions = {
    title: 'Create'
  }

  render() {
    return (
      <Container
        style={[ ContainerStyle.parentContainer, { backgroundColor: '#fff' } ]}
      >
        <Image
          style={styles.backdrop}
          source={require('./create_character.png')}
        >
          <Text style={styles.headline}>Build a New Character</Text>
        </Image>
        <Image
          style={styles.backdrop}
          source={require('./create_campaign.png')}
        >
          <Text style={styles.headline}>Record a New Campaign</Text>
        </Image>
      </Container>
    );
  }
}

var styles = StyleSheet.create({
  backdrop: {
    flex: 0.5,
    resizeMode: 'cover',
    width: undefined,
    height: undefined
  },
  headline: {
    fontSize: 24,
    textAlign: 'left',
    top: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    color: '#fff',
    width: '75%'
  }
});
