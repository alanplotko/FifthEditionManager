import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { Container, Tab, Tabs, TabHeading, Text, Icon } from 'native-base';
import FAB from 'react-native-fab';
import SnackBar from 'react-native-snackbar-component';
import store from 'react-native-simple-store';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';
import ActivityCard from 'DNDManager/components/ActivityCard';
import CharacterProfileCard from 'DNDManager/components/CharacterProfileCard';
import { ACTIVITY_KEY, CAMPAIGN_KEY, CHARACTER_KEY }
  from 'DNDManager/config/StoreKeys';

const CAMPAIGN_TAB = 1; // Campaign tab index
const CHARACTER_TAB = 2; // Character tab index

// Return compare function with the corresponding timestamp key
const compareDates = key => (a, b) => {
  if (a[key] > b[key]) {
    return -1;
  } else if (a[key] < b[key]) {
    return 1;
  }
  return 0;
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
      activity: [],
      campaigns: [],
      characters: [],
      fabAction: null,
      fabVisible: false,
      snackbarMessage: '',
      snackbarVisible: false,
    };
  }

  componentDidMount() {
    this.getData();
    const { state } = this.props.navigation;
    if (state.params && state.params.snackbarAction) {
      this.invokeSnackbar(
        state.params.snackbarAction.message,
        state.params.snackbarAction.duration,
      );
      delete state.params.snackbarAction;
    }
  }

  componentWillUnmount() {
    clearTimeout(this.showFab);
    clearTimeout(this.showSnackbar);
    clearTimeout(this.hideSnackbar);
  }

  onChangeTab = ({ i }) => {
    switch (i) {
      case CAMPAIGN_TAB:
        this.setState({
          fabVisible: true,
          fabAction: 'CreateCampaign',
        });
        break;
      case CHARACTER_TAB:
        this.setState({
          fabVisible: true,
          fabAction: 'CreateCharacter',
        });
        break;
      default:
        this.setState({
          fabVisible: false,
          fabAction: null,
        });
        break;
    }
  };

  getData = () => {
    store
      .get([ACTIVITY_KEY, CAMPAIGN_KEY, CHARACTER_KEY]).then((data) => {
        this.setState({
          activity: data[0] ? data[0].sort(compareDates('timestamp')) : [],
          campaigns: data[1] ? data[1] : [],
          characters: data[2] ? data[2].sort(compareDates('lastUpdated')) : [],
        });
      })
      .catch(error => error) // Propogate error
      .then((error) => {
        this.setState({ isLoading: false, isRefreshing: false }, () => {
          // Animate in snackbar after setting state and rerender
          if (error) {
            this.invokeSnackbar('Error loading data: try again later.', 5000);
          }
        });
      });
  };

  invokeSnackbar = (message, duration) => {
    this.showSnackbar = setTimeout(() => {
      this.setState({ snackbarVisible: true, snackbarMessage: message });
      this.hideSnackbar = setTimeout(() => {
        this.setState({ snackbarVisible: false });
      }, duration + 500); // Add time for setting state and rerender
    }, 500);
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
        <Tabs
          initialPage={0}
          locked
          onChangeTab={this.onChangeTab}
        >
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
                contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
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
                  <View item={item} />
                )}
                refreshing={this.state.isRefreshing}
                onRefresh={this.handleRefresh}
                contentContainerStyle={{ paddingTop: 10, paddingBottom: 100 }}
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
                renderItem={({ item }) => (
                  <CharacterProfileCard character={item} />
                )}
                refreshing={this.state.isRefreshing}
                onRefresh={this.handleRefresh}
                contentContainerStyle={{ paddingTop: 10, paddingBottom: 100 }}
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
        <FAB
          visible={this.state.fabVisible}
          buttonColor="#3F51B5"
          iconTextColor="#fff"
          iconTextComponent={<Icon name="add" />}
          onClickAction={() => navigate(this.state.fabAction)}
          snackOffset={this.state.snackbarVisible ? 40 : 0}
        />
        <SnackBar
          visible={this.state.snackbarVisible}
          textMessage={this.state.snackbarMessage}
        />
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
