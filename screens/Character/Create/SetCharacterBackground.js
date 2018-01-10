import React from 'react';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import { StyleSheet, ActivityIndicator, TouchableHighlight, View, Text }
  from 'react-native';
import {
  Card,
  CardItem,
  Container,
  Content,
  Icon,
  List,
  ListItem,
  Body,
} from 'native-base';
import { Toolbar } from 'react-native-material-ui';
import store from 'react-native-simple-store';
import { ACTIVITY_KEY, CHARACTER_KEY } from 'DNDManager/config/StoreKeys';
import { BACKGROUNDS } from 'DNDManager/config/Info';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';
import FormStyle from 'DNDManager/stylesheets/FormStyle';

const t = require('tcomb-form-native');
const uuidv4 = require('uuid/v4');

/**
 * Character background selection
 */

const CharacterBackground = t.struct({
  background: t.enums({
    Acolyte: 'Acolyte',
    Charlatan: 'Charlatan',
    Criminal: 'Criminal',
    Entertainer: 'Entertainer',
    'Folk Hero': 'Folk Hero',
    'Guild Artisan': 'Guild Artisan',
    Hermit: 'Hermit',
    Noble: 'Noble',
    Outlander: 'Outlander',
    Sage: 'Sage',
    Sailor: 'Sailor',
    Soldier: 'Soldier',
    Urchin: 'Urchin',
  }),
});

/**
 * Form template setup
 */

const template = locals => (
  <View>
    <View style={{ flex: 1 }}>
      {locals.inputs.background}
    </View>
  </View>
);

/**
 * Define form options
 */

const options = {
  template,
  fields: {
    background: {
      label: 'Background',
      nullOption: { value: '', text: 'Select Background' },
    },
  },
};

export default class SetCharacterBackground extends React.Component {
  static navigationOptions = {
    header: ({ navigation }) => {
      const props = {
        leftElement: 'arrow-back',
        onLeftElementPress: () => navigation.goBack(),
        centerElement: 'Character Background',
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
      selection: null,
      form: null,
      isSelectionLoading: false,
      error: null,
    };
  }

  componentWillUnmount() {
    clearTimeout(this.updateCard);
  }

  onPress = () => {
    const { state, dispatch } = this.props.navigation;
    const data = this.form.getValue();
    if (data) {
      const newCharacter = Object.assign({}, state.params.character);
      newCharacter.lastUpdated = Date.now();
      newCharacter.profile = Object.assign({}, newCharacter.profile, data);
      const newActivity = {
        key: uuidv4(),
        timestamp: newCharacter.lastUpdated,
        action: 'Created New Character',
        // Format character's full name for extra text
        extra: `${newCharacter.profile.firstName.charAt(0).toUpperCase()}${newCharacter.profile.firstName.slice(1)} ${newCharacter.profile.lastName.charAt(0).toUpperCase()}${newCharacter.profile.lastName.slice(1)}`,
        thumbnail: newCharacter.profile.images.race,
        icon: {
          name: 'add-circle',
          color: '#fff',
        },
      };
      store
        .push(CHARACTER_KEY, newCharacter)
        .catch((error) => {
          // Show error message on screen and allow resubmit
          this.setState({ error: 'Please try again in a few minutes.' });
          return error;
        })
        .then((error) => {
          if (error) return;
          store
            .push(ACTIVITY_KEY, newActivity)
            .then(() => {
              const resetAction = NavigationActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({
                  routeName: 'Home',
                })],
              });
              dispatch(resetAction);
            });
        });
    }
  }

  onChange = (value) => {
    this.setState({ isSelectionLoading: true, form: value }, () => {
      this.updateCard = setTimeout(() => {
        this.setState({
          selection: value ?
            BACKGROUNDS.find(option => option.name === value.background) :
            null,
          isSelectionLoading: false,
        });
      }, 500);
    });
  }

  render() {
    const list = BACKGROUNDS.map(option => (
      <View key={option.name}>
        {
          this.state.selection &&
          this.state.selection.name === option.name &&
          <View style={styles.absoluteCentered}>
            <Text style={styles.selectedText}>Selected</Text>
          </View>
        }
        <ListItem
          style={[
            { marginLeft: 0, paddingLeft: 20 },
            this.state.selection &&
            this.state.selection.name === option.name ?
            styles.selectedListItem :
            null,
          ]}
        >
          <Body>
            <Text style={styles.listItemHeading}>{option.name}</Text>
            <Text
              style={[
                styles.infoText,
                { paddingLeft: 0, paddingBottom: 10 },
              ]}
            >
              {option.description}
            </Text>
            <Text style={styles.infoHeading}>
              &#9656; Starting Equipment
            </Text>
            <Text style={[styles.infoText, { paddingBottom: 10 }]}>
              {option.equipment}
            </Text>
            <Text style={styles.infoHeading}>
              &#9656; Additional Languages
            </Text>
            <Text style={[styles.infoText, { paddingBottom: 10 }]}>
              {option.languages}
            </Text>
            <Text style={styles.infoHeading}>&#9656; Proficiencies</Text>
            <Text style={styles.infoText}>
              Skills: {option.proficiencies.skills}
            </Text>
            <Text style={styles.infoText}>
              Tools: {option.proficiencies.tools}
            </Text>
          </Body>
        </ListItem>
      </View>
    ));

    // Set up card for displaying currently selected option
    let displayCard = null;
    if (this.state.selection) {
      displayCard = (
        <Card>
          {
            this.state.isSelectionLoading &&
            <View style={styles.absoluteCentered}>
              <ActivityIndicator color="#3F51B5" size="large" />
            </View>
          }
          <View style={this.state.isSelectionLoading ? styles.loading : ''}>
            <CardItem>
              <Body>
                <Text style={styles.listItemHeading}>
                  {this.state.selection.name}
                </Text>
                <Text style={[styles.infoText, { paddingLeft: 0 }]}>
                  {this.state.selection.description}
                </Text>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <Text style={styles.infoHeading}>
                  &#9656; Starting Equipment
                </Text>
                <Text style={[styles.infoText, { paddingBottom: 10 }]}>
                  {this.state.selection.equipment}
                </Text>
                <Text style={styles.infoHeading}>
                  &#9656; Additional Languages
                </Text>
                <Text style={[styles.infoText, { paddingBottom: 10 }]}>
                  {this.state.selection.languages}
                </Text>
                <Text style={styles.infoHeading}>&#9656; Proficiencies</Text>
                <Text style={styles.infoText}>
                  Skills: {this.state.selection.proficiencies.skills}
                </Text>
                <Text style={styles.infoText}>
                  Tools: {this.state.selection.proficiencies.tools}
                </Text>
              </Body>
            </CardItem>
          </View>
        </Card>
      );
    } else {
      displayCard = (
        <Card>
          <CardItem cardBody style={styles.centered}>
            {
              this.state.isSelectionLoading &&
              <ActivityIndicator color="#3F51B5" size="large" />
            }
            {
              !this.state.isSelectionLoading &&
              <Icon name="information-circle" style={styles.messageIcon} />
            }
            {
              !this.state.isSelectionLoading &&
              <Text style={styles.displayCardHeading}>
                Selection details will display here
              </Text>
            }
          </CardItem>
        </Card>
      );
    }
    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <View style={{ margin: 20 }}>
            <Text style={FormStyle.heading}>Character Background</Text>
            {
              this.state.error &&
              <View style={styles.errorDialog}>
                <Text style={styles.errorHeading}>
                  An error occurred!
                </Text>
                <Text style={styles.errorText}>
                  {this.state.error.message}&nbsp;
                </Text>
              </View>
            }
            <t.form.Form
              ref={(c) => { this.form = c; }}
              type={CharacterBackground}
              value={this.state.form}
              options={options}
              onChange={this.onChange}
            />
            <TouchableHighlight
              style={[
                FormStyle.submitBtn,
                this.state.isSelectionLoading ?
                  { opacity: 0.5 } :
                  { opacity: 1 },
                { marginTop: 0, marginBottom: 10 },
              ]}
              onPress={this.onPress}
              underlayColor="#1A237E"
              disabled={this.state.isSelectionLoading}
            >
              <Text style={FormStyle.submitBtnText}>
                Set Background
              </Text>
            </TouchableHighlight>
            {displayCard}
          </View>
          <List>
            <ListItem itemHeader first style={{ paddingBottom: 0 }}>
              <Text style={[FormStyle.heading, { flex: 1 }]}>
                Background Options
              </Text>
            </ListItem>
            {list}
          </List>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  absoluteCentered: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
  },
  listItemHeading: {
    fontFamily: 'RobotoBold',
    color: '#000',
    fontSize: 20,
  },
  infoHeading: {
    fontFamily: 'RobotoBold',
    color: '#000',
    fontSize: 16,
    paddingLeft: 10,
  },
  infoText: {
    fontFamily: 'Roboto',
    color: '#666',
    fontSize: 14,
    paddingLeft: 10,
  },
  displayCardHeading: {
    fontFamily: 'RobotoLight',
    color: '#666',
    fontSize: 18,
  },
  messageIcon: {
    color: '#ccc',
    fontSize: 48,
    width: 48,
    height: 48,
    marginRight: 10,
  },
  loading: {
    opacity: 0.1,
  },
  selectedListItem: {
    opacity: 0.2,
    backgroundColor: '#b2f0b2',
  },
  selectedText: {
    fontFamily: 'RobotoLight',
    color: '#000',
    fontSize: 48,
  },
  errorDialog: {
    backgroundColor: '#F44336',
    marginBottom: 15,
    padding: 15,
    borderRadius: 3,
  },
  errorHeading: {
    fontFamily: 'RobotoBold',
    color: '#fff',
    fontSize: 18,
  },
  errorText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 14,
  },
});
