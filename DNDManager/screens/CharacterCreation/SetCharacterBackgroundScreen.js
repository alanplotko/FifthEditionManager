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
  ListHeader,
  ListItem,
  Thumbnail,
  Body,
  Text as NBText
} from 'native-base';
import store from 'react-native-simple-store';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';
import { CHARACTER_KEY } from 'DNDManager/config/StoreKeys';
import { RACES } from 'DNDManager/config/Info';
import FormStyle from 'DNDManager/stylesheets/FormStyle';

const t = require('tcomb-form-native');

/**
 * Character race selection
 */

const CharacterRace = t.struct({
  race: t.enums({
    'Dwarf': 'Dwarf',
    'Elf': 'Elf',
    'Halfling': 'Halfling',
    'Human': 'Human',
    'Dragonborn': 'Dragonborn',
    'Gnome': 'Gnome',
    'Half-Elf': 'Half-Elf',
    'Half-Orc': 'Half-Orc',
    'Tiefling': 'Tiefling',
  }),
});

/**
 * Form template setup
 */

const template = (locals) => {
  return (
    <View>
      <Text style={FormStyle.heading}>Character Race</Text>
      <View style={{ flex: 1 }}>
        {locals.inputs.race}
      </View>
    </View>
  );
}

/**
 * Define form options
 */

const options = {
  template: template,
  fields: {
    race: {
      label: 'Race',
      nullOption: { value: '', text: 'Select Race' },
    },
  },
};

export default class SetCharacterBackgroundScreen extends React.Component {
  static navigationOptions = {
    title: 'Character Background',
  }

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedRace: null,
      form: null,
      isSelectionLoading: false,
    };
  }

  componentWillUnmount() {
    clearTimeout(this.updateCard);
  }

  onPress = () => {
    const data = this.form.getValue();
    if (data) {
      // TO DO: Update for adding character background and not new character
      store.push(CHARACTER_KEY, {
        key: uuidv4(),
        profile: data,
      }).then(() => {
        // navigate('CreateCampaign');
      }).catch(error => {
        // TODO: Show error message on screen and allow resubmit
    		console.error(error);
    	});
    }
  }

  onChange = (value, path) => {
    this.setState({ isSelectionLoading: true });
    this.updateCard = setTimeout(() => {
      this.setState({
        selectedRace: value ?
          RACES.find(race => race.name === value.race) :
          null,
        form: value,
        isSelectionLoading: false,
      });
    }, 500);
  }

  render() {
    const list = RACES.map((race) => {
      if (this.state.selectedRace &&
          this.state.selectedRace.name === race.name) {
        return (
          <View key={race.name}>
            <View style={styles.absoluteCentered}>
              <Text style={styles.selected}>Selected</Text>
            </View>
            <ListItem
              style={{
                marginLeft: 0,
                paddingLeft: 20,
                opacity: 0.2,
                backgroundColor: '#b2f0b2'
              }}
            >
              <Thumbnail
                square
                style={{ width: 48, height: 48 }}
                source={race.portrait}
              />
              <Body>
                <NBText>{race.name}</NBText>
                <NBText note>{race.description}</NBText>
              </Body>
            </ListItem>
          </View>
        );
      }

      return (
        <ListItem key={race.name} style={{ marginLeft: 0, paddingLeft: 20 }}>
          <Thumbnail
            square
            style={{ width: 48, height: 48 }}
            source={race.portrait}
          />
          <Body>
            <NBText>{race.name}</NBText>
            <NBText note>{race.description}</NBText>
          </Body>
        </ListItem>
      );
    });

    // Set up card for displaying currently selected race
    let displayCard = null;
    if (this.state.selectedRace) {
      displayCard = (
        <Card>
          {
            this.state.isSelectionLoading &&
            <View style={styles.absoluteCentered}>
              <ActivityIndicator color="#3F51B5" size="large" />
            </View>
          }
          <View style={this.state.isSelectionLoading ? styles.loading : ''}>
            <CardItem cardBody >
              <Image
                source={this.state.selectedRace.portrait}
                style={{height: 150, width: null, flex: 1}}
              />
            </CardItem>
            <CardItem>
              <Body>
                <NBText>{this.state.selectedRace.name}</NBText>
                <NBText note>{this.state.selectedRace.description}</NBText>
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
            {displayCard}
            <TouchableHighlight
              style={FormStyle.submitBtn}
              onPress={this.onPress}
              underlayColor="#99d9f4"
            >
              <Text style={FormStyle.submitBtnText}>Set Race</Text>
            </TouchableHighlight>
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
  selected: {
    fontFamily: 'RobotoLight',
    color: '#000',
    fontSize: 48,
  }
});
