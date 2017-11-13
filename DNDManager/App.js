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

const ACTIVITY_KEY = '@DNDManager:activity';
const CAMPAIGN_KEY = '@DNDManager:campaign';
const CHARACTER_KEY = '@DNDManager:character';

export default class App extends Component {
  componentDidMount() {
    store.get([ACTIVITY_KEY, CAMPAIGN_KEY, CHARACTER_KEY]).then((data) => {
      this.setState({
        activity: data[0],
        campaigns: data[1],
        characters: data[2]
      });
    }).catch(error => {
      console.error('Store error (fetch profile): ' + error.message);
    }).then(() => {
      this.setState({isLoading: false});
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  render() {
    console.log(this.state);
    store.save([ACTIVITY_KEY, CAMPAIGN_KEY, CHARACTER_KEY], [{}, {}, {}]);
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
                !this.state.activity &&
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
                !this.state.campaigns &&
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
                !this.state.characters &&
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
