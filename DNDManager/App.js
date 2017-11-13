import React, { Component } from 'react';
import {
  Image,
  StyleSheet
} from 'react-native';
import { Container, Tab, Tabs, TabHeading, Icon, Text } from 'native-base';

import Loader from './components/Loader';
import ReactCard from './components/ReactCard';
import store from 'react-native-simple-store';
import Toolbar from './components/Toolbar';

const PROFILE_KEY = "@DNDManager:profile";

export default class App extends Component {
  async componentDidMount() {
    try {
      const profile = await store.get(PROFILE_KEY);
      store.delete(PROFILE_KEY);
      if (profile !== null) {
        this.setState({profile});
      }
    } catch (error) {
      console.error('Store error (fetch profile): ' + error.message);
    } finally {
      this.setState({isLoading: false});;
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  render() {
    if (this.state.isLoading) {
      return (
        <Container style={[styles.parentContainer, styles.centerScreen]}>
          <Loader />
        </Container>
      );
    }
    return (
      <Container style={styles.parentContainer}>
        <Toolbar />
        <Tabs initialPage={0}>
          <Tab heading={<TabHeading><Icon name="home" /></TabHeading>}>
            <Container style={styles.container}>
              {
                !this.state.profile &&
                  <ReactCard
                    header="First time here?"
                    body="You can create a new campaign or build a character.
                          Navigate to your tab of choice to get started!"
                  />
              }
            </Container>
          </Tab>
          <Tab heading={<TabHeading><Text>Campaigns</Text></TabHeading>}>
            <Container style={styles.container}>
              {
                !this.state.profile &&
                  <ReactCard
                    header="No Campaigns Found"
                    body="Let's get started!"
                  />
              }
            </Container>
          </Tab>
          <Tab heading={<TabHeading><Text>Characters</Text></TabHeading>}>
            <Container style={styles.container}>
              {
                !this.state.profile &&
                  <ReactCard
                    header="No Characters Found"
                    body="Let's get started!"
                  />
              }
            </Container>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: '#eee'
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20,
  },
  centerScreen: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  baseText: {
    fontFamily: 'Roboto',
    fontSize: 18,
    color: '#666'
  }
});
