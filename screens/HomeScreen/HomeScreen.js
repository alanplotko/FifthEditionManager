import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Alert, Dimensions, FlatList, StyleSheet, View, UIManager }
  from 'react-native';
import { Container, Icon as NBIcon, Tab, Tabs, TabHeading, Text } from 'native-base';
import Modal from 'react-native-modal';
import { ActionButton, Button, Icon, COLOR, Toolbar, withTheme } from 'react-native-material-ui';
import store from 'react-native-simple-store';
import ContainerStyle from 'FifthEditionManager/stylesheets/ContainerStyle';
import ActivityCard from 'FifthEditionManager/components/ActivityCard';
import CharacterProfileCard from 'FifthEditionManager/components/CharacterProfileCard';
import { getCharacterDisplayName } from 'FifthEditionManager/util';
import { IMAGES } from 'FifthEditionManager/config/Info';
import { ACTIVITY_KEY, CAMPAIGN_KEY, CHARACTER_KEY } from 'FifthEditionManager/config/StoreKeys';
import { get } from 'lodash';

const uuidv4 = require('uuid/v4');

// Return compare function with the corresponding timestamp key
const compareDates = key => (a, b) => {
  if (get(a, key) > get(b, key)) {
    return -1;
  } else if (get(a, key) < get(b, key)) {
    return 1;
  }
  return 0;
};

class HomeScreen extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
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

  async componentDidMount() {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    const callback = () => this.setState({ isLoading: false });
    await this.getData().then(callback);
  }

  onLayout = () => {
    const { width, height } = Dimensions.get('window');
    this.setState({ isPortrait: height >= width });
  };

  getData = () => new Promise((resolve) => {
    store
      .get([ACTIVITY_KEY, CAMPAIGN_KEY, CHARACTER_KEY])
      .then((data) => {
        this.setState({
          activity: data[0] ? data[0].sort(compareDates('timestamp')) : [],
          campaigns: data[1] ? data[1] : [],
          characters: data[2] ? data[2].sort(compareDates('meta.lastUpdated')) : [],
        }, () => resolve(data));
      })
      .catch(error => this.setState({ error }, () => resolve(null)));
  });

  static navigationOptions = {
    header: () => {
      const props = {
        centerElement: 'Fifth Edition Manager',
      };
      return <Toolbar {...props} />;
    },
  }

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
                thumbnail: IMAGES.RACE[character.race.lookupKey],
                icon: {
                  name: 'delete-forever',
                  color: COLOR.white,
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
    const callback = () => this.setState({ isRefreshing: false });
    this.setState({ isRefreshing: true }, async () => this.getData().then(callback));
  };

  render() {
    const { navigate } = this.props.navigation;

    // Theme setup
    const { primaryColor, backdropIconColor, modalBackgroundColor } = this.props.theme.palette;
    const modalStyle = { backgroundColor: modalBackgroundColor };

    const errorView = (
      <View style={styles.centered} onLayout={() => this.onLayout()}>
        <Icon name="error" size={this.state.isPortrait ? 156 : 64} color={backdropIconColor} />
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
          <ActivityIndicator color={primaryColor} size="large" />
        </Container>
      );
    }

    return (
      <Container style={[ContainerStyle.parent, ContainerStyle.centered]}>
        <Tabs initialPage={0} locked>
          <Tab
            heading={<TabHeading><NBIcon name="home" /></TabHeading>}
            style={styles.tab}
          >
            { this.state.error && errorView }
            {
              !this.state.error && this.state.activity.length > 0 &&
              <FlatList
                data={this.state.activity}
                renderItem={
                  ({ item }) => <ActivityCard activity={item} />
                }
                refreshing={this.state.isRefreshing}
                onRefresh={this.handleRefresh}
                contentContainerStyle={styles.flatlist}
              />
            }
            {
              !this.state.error && this.state.activity.length === 0 &&
              <View style={styles.centered}>
                <Icon name="timeline" size={156} color={backdropIconColor} />
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
                contentContainerStyle={styles.flatlist}
              />
            }
            {
              !this.state.error && this.state.campaigns.length === 0 &&
              <View style={styles.centered}>
                <Icon name="book" size={156} color={backdropIconColor} />
                <Text style={styles.heading}>
                  First time here?
                </Text>
                <Text style={styles.text}>
                  No existing campaigns found.
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
                contentContainerStyle={styles.flatlist}
              />
            }
            {
              !this.state.error && this.state.characters.length === 0 &&
              <View style={styles.centered}>
                <Icon name="person" size={156} color={backdropIconColor} />
                <Text style={styles.heading}>
                  First time here?
                </Text>
                <Text style={styles.text}>
                  No existing characters found.
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
            name: null,
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
          style={styles.modal}
        >
          <View style={[styles.modalView, modalStyle]}>
            {this.state.modalContent}
          </View>
        </Modal>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  centered: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatlist: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 100,
  },
  modal: {
    margin: 0,
  },
  tab: {
    backgroundColor: COLOR.grey200,
  },
  heading: {
    fontFamily: 'RobotoLight',
    color: COLOR.grey700,
    fontSize: 24,
    paddingBottom: 10,
  },
  text: {
    fontFamily: 'RobotoLight',
    color: COLOR.grey700,
    fontSize: 18,
    paddingBottom: 5,
  },
  modalView: {
    flex: 1,
    backgroundColor: COLOR.white,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default withTheme(HomeScreen);
