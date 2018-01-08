import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ActivityIndicator, TouchableHighlight, View, Text, Image }
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
  Text as NBText,
} from 'native-base';
import { Toolbar } from 'react-native-material-ui';
import { RACES } from 'DNDManager/config/Info';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';
import FormStyle from 'DNDManager/stylesheets/FormStyle';

const t = require('tcomb-form-native');

/**
 * Character race selection
 */

const CharacterRace = t.struct({
  race: t.enums({
    Dwarf: 'Dwarf',
    Elf: 'Elf',
    Halfling: 'Halfling',
    Human: 'Human',
    Dragonborn: 'Dragonborn',
    Gnome: 'Gnome',
    'Half-Elf': 'Half-Elf',
    'Half-Orc': 'Half-Orc',
    Tiefling: 'Tiefling',
  }),
});

/**
 * Form template setup
 */

const template = locals => (
  <View>
    <Text style={FormStyle.heading}>Character Race</Text>
    <View style={{ flex: 1 }}>
      {locals.inputs.race}
    </View>
  </View>
);

/**
 * Define form options
 */

const options = {
  template,
  fields: {
    race: {
      label: 'Race',
      nullOption: { value: '', text: 'Select Race' },
    },
  },
};

export default class SetCharacterRace extends React.Component {
  static navigationOptions = {
    header: ({ navigation }) => {
      const props = {
        leftElement: 'arrow-back',
        onLeftElementPress: () => navigation.goBack(),
        centerElement: 'Character Race',
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
    };
  }

  componentWillUnmount() {
    clearTimeout(this.updateCard);
  }

  onPress = () => {
    const { navigate, state } = this.props.navigation;
    const data = this.form.getValue();
    if (data) {
      const newCharacter = Object.assign({}, state.params.character);
      newCharacter.lastUpdated = Date.now();
      newCharacter.profile = Object.assign({}, newCharacter.profile, data);
      newCharacter.profile.images = Object.assign(
        {},
        newCharacter.profile.images,
        { race: this.state.selection.image },
      );
      navigate('SetCharacterClass', { character: newCharacter });
    }
  }

  onChange = (value) => {
    this.setState({ isSelectionLoading: true, form: value }, () => {
      this.updateCard = setTimeout(() => {
        this.setState({
          selection: value ?
            RACES.find(option => option.name === value.race) :
            null,
          isSelectionLoading: false,
        });
      }, 500);
    });
  }

  render() {
    const list = RACES.map(option => (
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
          <Image
            style={{ width: 48, height: 48 }}
            source={option.image}
          />
          <Body>
            <NBText>{option.name}</NBText>
            <NBText note>{option.description}</NBText>
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
            <CardItem cardBody>
              <Image
                source={this.state.selection.image}
                style={{ height: 150, flex: 1 }}
              />
            </CardItem>
            <CardItem>
              <Body>
                <NBText>{this.state.selection.name}</NBText>
                <NBText note>{this.state.selection.description}</NBText>
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
              <Text style={styles.heading}>
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
            <t.form.Form
              ref={(c) => { this.form = c; }}
              type={CharacterRace}
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
                Set Race
              </Text>
            </TouchableHighlight>
            {displayCard}
          </View>
          <List>
            <ListItem itemHeader first style={{ paddingBottom: 0 }}>
              <Text style={[FormStyle.heading, { flex: 1 }]}>
                Race Options
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
  heading: {
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
});
