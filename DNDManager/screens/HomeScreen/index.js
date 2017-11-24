import React, { Component } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Container, Tab, Tabs, TabHeading, Text, Icon, Button, Fab }
  from 'native-base';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';

import Loader from 'DNDManager/components/Loader';
import ActivityCard from 'DNDManager/components/ActivityCard';
import store from 'react-native-simple-store';

const ACTIVITY_KEY = '@DNDManager:activity';
const CAMPAIGN_KEY = '@DNDManager:campaign';
const CHARACTER_KEY = '@DNDManager:character';

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'D&D Manager'
  }

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
    store.save([ACTIVITY_KEY, CAMPAIGN_KEY, CHARACTER_KEY], [{}, {}, {}]);
    if (this.state.isLoading) {
      return (
        <Container
          style={[ContainerStyle.parentContainer, ContainerStyle.centerScreen]}
        >
          <Loader />
        </Container>
      );
    }
    return (
      <Container style={ContainerStyle.parentContainer}>
        <Tabs initialPage={0}>
          <Tab heading={<TabHeading><Icon name="home" /></TabHeading>}>
            <Container style={ContainerStyle.container}>
              {
                !this.state.activity &&
                  <ActivityCard
                    header="First time here?"
                    body="Your activity feed will populate here over time.
                          To get started, create a character or campaign!"
                  />
              }
            </Container>
          </Tab>
          <Tab heading={<TabHeading><Text>Campaigns</Text></TabHeading>}>
            <Container style={ContainerStyle.container}>
              {
                !this.state.campaigns &&
                  <ActivityCard
                    header="No Campaigns Found"
                    body="Let's get started!"
                  />
              }
            </Container>
          </Tab>
          <Tab heading={<TabHeading><Text>Characters</Text></TabHeading>}>
            <Container style={ContainerStyle.container}>
              {
                !this.state.characters &&
                  <ActivityCard
                    header="No Characters Found"
                    body="Let's get started!"
                  />
              }
            </Container>
          </Tab>
        </Tabs>
        <Fab
          active={this.state.canCreate}
          direction="up"
          style={styles.fab}
          position="bottomRight"
          onPress={() => this.props.navigation.navigate('Create')}
        >
          <Icon name="add" />
        </Fab>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  fab: {
    backgroundColor: '#3F51B5'
  }
});
