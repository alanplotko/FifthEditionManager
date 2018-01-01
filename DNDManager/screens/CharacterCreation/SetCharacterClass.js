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
  Left,
  List,
  ListItem,
  Body,
} from 'native-base';

import { CLASSES } from 'DNDManager/config/Info';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';
import FormStyle from 'DNDManager/stylesheets/FormStyle';

const t = require('tcomb-form-native');

/**
 * Character class selection
 */

const CharacterBaseClass = t.struct({
  baseClass: t.enums({
    Barbarian: 'Barbarian',
    Bard: 'Bard',
    Cleric: 'Cleric',
    Druid: 'Druid',
    Fighter: 'Fighter',
    Monk: 'Monk',
    Paladin: 'Paladin',
    Ranger: 'Ranger',
    Rogue: 'Rogue',
    Sorcerer: 'Sorcerer',
    Warlock: 'Warlock',
    Wizard: 'Wizard',
  }),
});

/**
 * Form template setup
 */

const template = locals => (
  <View>
    <Text style={FormStyle.heading}>Character Class</Text>
    <View style={{ flex: 1 }}>
      {locals.inputs.baseClass}
    </View>
  </View>
);

/**
 * Define form options
 */

const options = {
  template,
  fields: {
    baseClass: {
      label: 'Class',
      nullOption: { value: '', text: 'Select Class' },
    },
  },
};

export default class SetCharacterClass extends React.Component {
  static navigationOptions = {
    title: 'Character Class',
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
        { baseClass: this.state.selection.image },
      );
      navigate('SetCharacterBackground', { character: newCharacter });
    }
  }

  onChange = (value) => {
    this.setState({ isSelectionLoading: true, form: value }, () => {
      this.updateCard = setTimeout(() => {
        this.setState({
          selection: value ?
            CLASSES.find(option => option.name === value.baseClass) :
            null,
          isSelectionLoading: false,
        });
      }, 500);
    });
  }

  render() {
    const list = CLASSES.map(option => (
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
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <Image
                resizeMode="contain"
                style={{ width: 64, height: 64, flex: 0.2 }}
                source={option.image}
              />
              <View style={{ flex: 0.8 }}>
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
                  &#9656; Hit Die / Primary Ability
                </Text>
                <Text style={[styles.infoText, { paddingBottom: 10 }]}>
                  {option.hitDie} / {option.primaryAbility}
                </Text>
                <Text style={styles.infoHeading}>&#9656; Proficiencies</Text>
                <Text style={styles.infoText}>
                  Saving Throw: {option.proficiencies.savingThrow}
                </Text>
                <Text style={styles.infoText}>
                  Armor & Weapons: {option.proficiencies.armorAndWeapon}
                </Text>
              </View>
            </View>
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
              <Left>
                <Image
                  resizeMode="contain"
                  source={this.state.selection.image}
                  style={{ width: 100, height: 100 }}
                />
                <Body>
                  <Text style={styles.listItemHeading}>
                    {this.state.selection.name}
                  </Text>
                  <Text style={[styles.infoText, { paddingLeft: 0 }]}>
                    {this.state.selection.description}
                  </Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
                <Text style={styles.infoHeading}>
                  &#9656; Hit Die / Primary Ability
                </Text>
                <Text style={[styles.infoText, { paddingBottom: 10 }]}>
                  {this.state.selection.hitDie}
                  &nbsp;/ {this.state.selection.primaryAbility}
                </Text>
                <Text style={styles.infoHeading}>&#9656; Proficiencies</Text>
                <Text style={styles.infoText}>
                  Saving Throw:
                  &nbsp;{this.state.selection.proficiencies.savingThrow}
                </Text>
                <Text style={styles.infoText}>
                  Armor & Weapons:
                  &nbsp;{this.state.selection.proficiencies.armorAndWeapon}
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
            <t.form.Form
              ref={(c) => { this.form = c; }}
              type={CharacterBaseClass}
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
                Set Class
              </Text>
            </TouchableHighlight>
            {displayCard}
          </View>
          <List>
            <ListItem itemHeader first style={{ paddingBottom: 0 }}>
              <Text style={[FormStyle.heading, { flex: 1 }]}>
                Class Options
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
});
