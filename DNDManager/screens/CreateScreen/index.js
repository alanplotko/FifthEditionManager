import React, { Component } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Container, Text } from 'native-base';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';
import OptionCard from 'DNDManager/components/OptionCard';

export default class CreateScreen extends Component {
  static navigationOptions = {
    title: 'Create'
  }

  render() {
    return (
      <Container style={ContainerStyle.paddedContainer}>
        <OptionCard
          label='Character'
          description='In need a fresh start? Get started by building a new character to add to your adventures.'
          image={require('DNDManager/assets/images/create_character.png')}
          actionIcon='person'
          actionText='Build a New Character'
        />
        <OptionCard
          label='Campaign'
          description='Going on a new adventure? Get started by setting up a new campaign to record your tale.'
          image={require('DNDManager/assets/images/create_campaign.png')}
          actionIcon='book'
          actionText='Start a New Campaign'
        />
      </Container>
    );
  }
}

var styles = StyleSheet.create({
});
