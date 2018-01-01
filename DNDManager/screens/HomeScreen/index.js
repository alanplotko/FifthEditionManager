import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { Container, Tab, Tabs, TabHeading, Text, Icon, Button, Fab }
  from 'native-base';

import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';
import ActivityCard from 'DNDManager/components/ActivityCard';
import CharacterProfileCard from 'DNDManager/components/CharacterProfileCard';
import store from 'react-native-simple-store';
import { ACTIVITY_KEY, CAMPAIGN_KEY, CHARACTER_KEY }
  from 'DNDManager/config/StoreKeys';

// Return compare function with the corresponding timestamp key
const compareDates = key => (a, b) => {
  if (a[key] > b[key]) {
    return -1;
  } else if (a[key] < b[key]) {
    return 1;
  }
  return 0;
};

const fillerCard = {
  key: 'spacing',
  timestamp: 0,
  lastUpdated: 0,
};

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
      fabVisible: true,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    store.get([ACTIVITY_KEY, CAMPAIGN_KEY, CHARACTER_KEY]).then((data) => {
      data.forEach((set) => {
        if (set) set.push(fillerCard);
      });
      this.setState({
        activity: data[0] ? data[0].sort(compareDates('timestamp')) : [],
        campaigns: data[1] ? data[1] : [],
        characters: data[2] ? data[2].sort(compareDates('lastUpdated')) : [],
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
            style={styles.tab}
          >
            {
              this.state.activity.length > 0 &&
              <FlatList
                data={this.state.activity}
                renderItem={({ item }) => {
                  if (item.key === 'spacing') {
                    return <View style={{ paddingTop: 100 }} />;
                  }
                  return <ActivityCard activity={item} />;
                }}
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
            style={styles.tab}
          >
            {
              this.state.campaigns.length > 0 &&
              <FlatList
                data={this.state.campaigns}
                renderItem={({ item }) => (
                  <CharacterProfileCard />
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
                  Let&apos;s get started!
                </Text>
              </View>
            }
          </Tab>
          <Tab
            heading={<TabHeading><Text>Characters</Text></TabHeading>}
            style={styles.tab}
          >
            {
              this.state.characters.length > 0 &&
              <FlatList
                data={this.state.characters}
                renderItem={({ item }) => {
                  if (item.key === 'spacing') {
                    return <View style={{ paddingTop: 100 }} />;
                  }
                  return <CharacterProfileCard character={item} />;
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
                  Let&apos;s get started!
                </Text>
              </View>
            }
          </Tab>
        </Tabs>
        {
          this.state.fabVisible &&
          <Fab
            active={this.state.fabActive}
            direction="up"
            style={{ backgroundColor: '#3F51B5' }}
            position="bottomRight"
            onPress={() => this.setState({ fabActive: !this.state.fabActive })}
          >
            <Icon name="add" />
            {
              this.state.fabActive && [
                <Button
                  key="CreateCharacter"
                  style={{ backgroundColor: '#999' }}
                  onPress={() => {
                    this.setState({ fabActive: false });
                    navigate('CreateCharacter');
                  }}
                >
                  <Icon name="person" />
                </Button>,
                <Button
                  key="CreateCampaign"
                  style={{ backgroundColor: '#999' }}
                  onPress={() => {
                    this.setState({ fabActive: false });
                    navigate('CreateCampaign');
                  }}
                >
                  <Icon name="book" />
                </Button>,
              ]
            }
          </Fab>
        }
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
    marginTop: 60,
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
