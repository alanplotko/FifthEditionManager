import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { Container, Tab, Tabs, TabHeading, Text, Icon, Button, Fab }
  from 'native-base';

import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';
import ActivityCard from 'DNDManager/components/ActivityCard';
import store from 'react-native-simple-store';
import { ACTIVITY_KEY, CAMPAIGN_KEY, CHARACTER_KEY }
  from 'DNDManager/config/StoreKeys';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'D&D Manager',
  }

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isRefreshing: false,
      fabActive: false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  compareDates = (a, b) => {
    if (a.timestamp > b.timestamp) {
      return 1;
    } else if (a.timestamp < b.timestamp) {
      return -1;
    } else {
      return 0;
    }
  }

  getData = () => {
    store.get([ACTIVITY_KEY, CAMPAIGN_KEY, CHARACTER_KEY]).then((data) => {
      this.setState({
          activity: data[0] ? data[0].sort(compareDates) : [],
          campaigns: data[1] ? data[1].sort(compareDates) : [],
          characters: data[2] ? data[2].sort(compareDates) : [],
      });
    }).catch((error) => {
      // TODO: Show error message on screen that encourages user to refresh again
      console.error(`Store error (fetch profile): ${error.message}`);
    }).then(() => {
      this.setState({ isLoading: false, isRefreshing: false });
    });
  };

  handleRefresh = () => {
    this.setState({ isRefreshing: true });
    this.getData();
  };

  render() {
    const { navigate } = this.props.navigation;

    if (this.state.isLoading) {
      return (
        <Container style={[ContainerStyle.parent, ContainerStyle.centered]}>
          <ActivityIndicator color="#3F51B5" size="large" />
        </Container>
      );
    }

    return (
      <Container style={[ContainerStyle.parent, ContainerStyle.centered]}>
        <Tabs initialPage={0} locked>
          <Tab
            heading={<TabHeading><Icon name="home" /></TabHeading>}
            style={[styles.tab, ContainerStyle.padded]}
          >
            {
              this.state.activity.length > 0 &&
              <FlatList
                data={this.state.activity}
                renderItem={({ item }) => (
                  <ActivityCard header={item.header} body={item.body} />
                )}
                refreshing={this.state.isRefreshing}
                onRefresh={this.handleRefresh}
              />
            }
            {
              this.state.activity.length === 0 &&
              <View style={styles.centered}>
                <Icon name="analytics" style={styles.messageIcon} />
                <Text style={styles.heading}>
                  First time here?
                </Text>
                <Text style={styles.text}>
                  Your activity feed will populate here over time.
                </Text>
                <Text style={styles.text}>
                  To get started, create a character or campaign!
                </Text>
              </View>
            }
          </Tab>
          <Tab
            heading={<TabHeading><Text>Campaigns</Text></TabHeading>}
            style={[styles.tab, ContainerStyle.padded]}
          >
            {
              this.state.campaigns.length > 0 &&
              <FlatList
                data={this.state.campaigns}
                renderItem={({ item }) => (
                  <ActivityCard header={item.header} body={item.body} />
                )}
                refreshing={this.state.isRefreshing}
                onRefresh={this.handleRefresh}
              />
            }
            {
              this.state.campaigns.length === 0 &&
              <View style={styles.centered}>
                <Icon name="document" style={styles.messageIcon} />
                <Text style={styles.heading}>
                  First time here?
                </Text>
                <Text style={styles.text}>
                  No campaigns found.
                </Text>
                <Text style={styles.text}>
                  Let's get started!
                </Text>
              </View>
            }
          </Tab>
          <Tab
            heading={<TabHeading><Text>Characters</Text></TabHeading>}
            style={[styles.tab, ContainerStyle.padded]}
          >
            {
              this.state.characters.length > 0 &&
              <FlatList
                data={this.state.characters}
                renderItem={({ item }) => {
                  if (item.key === 'defaultCard') {
                    return (
                      <ActivityCard header={item.header} body={item.body} />
                    );
                  }
                  return (
                    <ActivityCard
                      header={
                        `${item.profile.firstName} ${item.profile.lastName}`
                      }
                      body={`Level ${item.profile.level}`}
                    />
                  );
                }}
                refreshing={this.state.isRefreshing}
                onRefresh={this.handleRefresh}
              />
            }
            {
              this.state.characters.length === 0 &&
              <View style={styles.centered}>
                <Icon name="person" style={styles.messageIcon} />
                <Text style={styles.heading}>
                  First time here?
                </Text>
                <Text style={styles.text}>
                  No characters found.
                </Text>
                <Text style={styles.text}>
                  Let's get started!
                </Text>
              </View>
            }
          </Tab>
        </Tabs>
        <Fab
          active={this.state.fabActive}
          direction="up"
          style={{ backgroundColor: '#3F51B5' }}
          position="bottomRight"
          onPress={() => this.setState({ fabActive: !this.state.fabActive })}
        >
          <Icon name="add" />
          <Button
            style={{ backgroundColor: '#999' }}
            onPress={() => {
              this.setState({ fabActive: false });
              navigate('CreateCharacter');
            }}
          >
            <Icon name="person" />
          </Button>
          <Button
            style={{ backgroundColor: '#999' }}
            onPress={() => {
              this.setState({ fabActive: false });
              navigate('CreateCampaign');
            }}
          >
            <Icon name="book" />
          </Button>
        </Fab>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  tab: {
    backgroundColor: '#eee',
  },
  centered: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 30,
  },
  heading: {
    fontFamily: 'RobotoLight',
    color: '#666',
    fontSize: 24,
    marginBottom: 10,
  },
  text: {
    fontFamily: 'RobotoLight',
    color: '#666',
    fontSize: 18,
  },
  messageIcon: {
    color: '#ccc',
    fontSize: 156,
  },
});
