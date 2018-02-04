import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Alert, FlatList, StyleSheet, View, UIManager }
  from 'react-native';
import { Container, Tab, Tabs, TabHeading, Text, Icon } from 'native-base';
import Modal from 'react-native-modal';
import { ActionButton, Button, COLOR, Toolbar } from 'react-native-material-ui';
import store from 'react-native-simple-store';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';
import ActivityCard from 'DNDManager/components/ActivityCard';
import CharacterProfileCard from 'DNDManager/components/CharacterProfileCard';
import { getCharacterDisplayName } from 'DNDManager/util';
import { ACTIVITY_KEY, CAMPAIGN_KEY, CHARACTER_KEY }
  from 'DNDManager/config/StoreKeys';

const uuidv4 = require('uuid/v4');

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
    header: () => {
      const props = {
        centerElement: 'D&D Manager',
      };
      return <Toolbar {...props} />;
    },
  }

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isRefreshing: false,
      isModalVisible: false,
      modalContent: null,
      error: null,
      activity: [],
      campaigns: [],
      characters: [],
    };
  }

  componentWillMount() {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    store
      .get([ACTIVITY_KEY, CAMPAIGN_KEY, CHARACTER_KEY])
      .then((data) => {
        this.setState({
          activity: data[0] ? data[0].sort(compareDates('timestamp')) : [],
          campaigns: data[1] ? data[1] : [],
          characters: data[2] ? data[2].sort(compareDates('lastUpdated')) : [],
        });
      })
      .catch(error => error) // Propogate error
      .then((error) => {
        this.setState({ isLoading: false, isRefreshing: false, error });
      });
  };

  openModal = (modalContent) => {
    this.setState({ isModalVisible: true, modalContent });
  };

  closeModal = (done) => {
    this.setState({ isModalVisible: false, modalContent: null }, done);
  };

  viewCharacter = () => {};

  editCharacter = () => {};

  removeCharacter = (key, deleteActivity, done) => {
    store
      .get(CHARACTER_KEY)
      .then((characters) => {
        characters.splice(characters.findIndex(c => c.key === key), 1);
        store
          .save(CHARACTER_KEY, characters)
          .then(() => {
            store
              .push(ACTIVITY_KEY, deleteActivity)
              .then(done);
          });
      });
  };

  askDeleteCharacter = (character) => {
    const fullName = getCharacterDisplayName(character);
    this.closeModal(() => {
      Alert.alert(
        'Character Deletion',
        `You are about to permanently remove ${fullName}.`,
        [
          { text: 'Cancel', onPress: () => {}, style: 'cancel' },
          {
            text: 'Delete',
            onPress: () => {
              const deleteActivity = {
                key: uuidv4(),
                timestamp: Date.now(),
                action: 'Deleted Character',
                extra: fullName,
                thumbnail: character.profile.images.race,
                icon: {
                  name: 'delete-forever',
                  color: '#fff',
                },
              };
              this.removeCharacter(
                character.key,
                deleteActivity,
                this.handleRefresh,
              );
            },
          },
        ],
        { cancelable: false },
      );
    });
  };

  handleRefresh = () => {
    this.setState({ isRefreshing: true }, () => this.getData());
  };

  render() {
    const { navigate } = this.props.navigation;
    const errorView = (
      <View style={styles.centered}>
        <Icon name="alert" style={styles.messageIcon} />
        <Text style={styles.heading}>
          An error occurred!
        </Text>
        <Text style={styles.text}>
          We had some trouble fetching your data.
        </Text>
        <Button
          primary
          text="Refresh"
          disabled={this.state.isRefreshing}
          onPress={this.handleRefresh}
          icon="refresh"
          style={{ container: { marginTop: 10 } }}
        />
      </View>
    );

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
            { this.state.error && errorView }
            {
              !this.state.error && this.state.activity.length > 0 &&
              <FlatList
                data={this.state.activity}
                renderItem={({ item }) => <ActivityCard activity={item} />}
                refreshing={this.state.isRefreshing}
                onRefresh={this.handleRefresh}
                contentContainerStyle={{ paddingTop: 10, paddingBottom: 100 }}
              />
            }
            {
              !this.state.error && this.state.activity.length === 0 &&
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
            { this.state.error && errorView }
            {
              !this.state.error && this.state.campaigns.length > 0 &&
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
              !this.state.error && this.state.campaigns.length === 0 &&
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
            { this.state.error && errorView }
            {
              !this.state.error && this.state.characters.length > 0 &&
              <FlatList
                data={this.state.characters}
                renderItem={({ item }) => (
                  <CharacterProfileCard
                    character={item}
                    modalHandler={this.openModal}
                    viewHandler={this.viewCharacter}
                    editHandler={this.editCharacter}
                    deleteHandler={this.askDeleteCharacter}
                  />
                )}
                refreshing={this.state.isRefreshing}
                onRefresh={this.handleRefresh}
                contentContainerStyle={{ paddingTop: 10, paddingBottom: 100 }}
              />
            }
            {
              !this.state.error && this.state.characters.length === 0 &&
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
        <ActionButton
          onPress={dst => navigate(dst)}
          icon="add"
          actions={[{
            icon: 'book',
            label: 'Campaign',
            name: 'CreateCampaign',
          }, {
            icon: 'person',
            label: 'Character',
            name: 'SetCharacterRace',
          }]}
          rippleColor={COLOR.red200}
          transition="speedDial"
          style={{
            container: {
              elevation: 6,
            },
            overlayContainer: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            speedDialActionLabel: {
              paddingTop: 2,
              paddingBottom: 2,
              paddingLeft: 5,
              paddingRight: 5,
            },
          }}
        />
        <Modal
          isVisible={this.state.isModalVisible}
          onBackButtonPress={() => this.setState({ isModalVisible: false })}
          onBackdropPress={() => this.setState({ isModalVisible: false })}
          backdropOpacity={0.5}
          style={{ margin: 0 }}
        >
          <View style={styles.modalView}>
            {this.state.modalContent}
          </View>
        </Modal>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontFamily: 'RobotoLight',
    color: '#666',
    fontSize: 24,
    marginBottom: 10,
  },
  modalView: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
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
