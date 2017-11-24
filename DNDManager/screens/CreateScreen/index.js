import React, { Component } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Container, Tab, Tabs, TabHeading, Text, Icon, Button, Fab }
  from 'native-base';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';

import Loader from 'DNDManager/components/Loader';
import ActivityCard from 'DNDManager/components/ActivityCard';
import store from 'react-native-simple-store';

export default class CreateScreen extends Component {
  static navigationOptions = {
    title: 'Create'
  }

  render() {
    return (
      <Container style={ContainerStyle.parentContainer}>
      </Container>
    );
  }
}
