import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableHighlight,
  Text,
  ScrollView,
  View
} from 'react-native';
import { Container, Content } from 'native-base';
import store from 'react-native-simple-store';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';
import { CHARACTER_KEY } from 'DNDManager/config/StoreKeys';
import { EXPERIENCE } from 'DNDManager/config/Info';
import FormStyle from 'DNDManager/stylesheets/FormStyle';

const t = require('tcomb-form-native');
const _ = require('lodash');
const uuidv4 = require('uuid/v4');

/**
 * Form valdiation setup
 */

const validateInteger = (value, altErrorMessage) => {
 if (value === null || value === undefined) return 'Required';
 return (value % 1 !== 0) ? 'Integer only' : altErrorMessage;
}

// Integer in range [1, 20]
const Level = t.refinement(t.Number, n => n % 1 === 0 && n > 0 && n <= 20);
Level.getValidationErrorMessage = (value) => {
  return validateInteger(value, 'Range [1, 20]');
};

// Integer >= 0
const Experience = t.refinement(t.Number, n => n % 1 === 0 && n >= 0);
Experience.getValidationErrorMessage = (value, path, context) => {
  return validateInteger(value, 'Minimum of 0');
};

// Integer >= 1
const Age = t.refinement(t.Number, n => n % 1 === 0 && n >= 1);
Age.getValidationErrorMessage = (value) => {
  return validateInteger(value, 'Minimum of 1');
};

const defaultError = () => 'Required';
t.Number.getValidationErrorMessage = defaultError;
t.String.getValidationErrorMessage = defaultError;

/**
 * Define character
 */

const Character = t.struct({
  level: Level,
  experience: Experience,
  firstName: t.String,
  lastName: t.String,
  gender: t.enums({
    Male: 'Male',
    Female: 'Female',
    Other: 'Other',
  }),
  alignment: t.enums({
    'Lawful Good': 'Lawful Good',
    'Lawful Neutral': 'Lawful Neutral',
    'Lawful Evil': 'Lawful Evil',
    'Neutral Good': 'Neutral Good',
    'True Neutral': 'True Neutral',
    'Neutral Evil': 'Neutral Evil',
    'Chaotic Good': 'Chaotic Good',
    'Chaotic Neutral': 'Chaotic Neutral',
    'Chaotic Evil': 'Chaotic Evil',
  }),
  age: Age,
  height: t.String,
  weight: t.String,
});

/**
 * Form template setup
 */

const template = (locals) => {
  return (
    <View>
      <Text style={FormStyle.heading}>Character Name</Text>
      <View style={FormStyle.horizontalLayout}>
        <View style={{ flex: 1, marginRight: 5 }}>
          {locals.inputs.firstName}
        </View>
        <View style={{ flex: 1, marginLeft: 5 }}>
          {locals.inputs.lastName}
        </View>
      </View>

      <Text style={FormStyle.heading}>Power</Text>
      {locals.inputs.level}
      {locals.inputs.experience}

      <Text style={FormStyle.heading}>About</Text>
      <View style={FormStyle.horizontalLayout}>
        <View style={{ flex: 1 }}>
          {locals.inputs.gender}
        </View>
        <View style={{ flex: 1 }}>
          {locals.inputs.alignment}
        </View>
      </View>

      <Text style={FormStyle.heading}>Measurements</Text>
      <View style={FormStyle.horizontalLayout}>
        <View style={{ flex: 1, marginRight: 5 }}>
          {locals.inputs.age}
        </View>
        <View style={{ flex: 1, marginLeft: 5, marginRight: 5 }}>
          {locals.inputs.height}
        </View>
        <View style={{ flex: 1, marginLeft: 5 }}>
          {locals.inputs.weight}
        </View>
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
    firstName: {
      label: 'First Name',
    },
    lastName: {
      label: 'Last Name',
    },
    level: {
      label: 'Level',
      placeholder: 'Integer in [1, 20]',
    },
    experience: {
      label: 'Experience Points',
      placeholder: 'Integer >= 0',
      help: 'Select level to view range',
    },
    gender: {
      label: 'Gender',
      nullOption: { value: '', text: 'Select Gender' },
    },
    alignment: {
      label: 'Alignment',
      nullOption: { value: '', text: 'Select Alignment' },
    },
    age: {
      label: 'Age',
      placeholder: 'In years',
    },
    height: {
      label: 'Height',
      placeholder: 'e.g. 5\'5\"',
    },
    weight: {
      label: 'Weight',
      placeholder: 'e.g. 130 lbs.',
    },
  },
};

export default class CreateCharacterScreen extends React.Component {
  static navigationOptions = {
    title: 'New Character',
  }

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      options: options,
      form: null,
    };
  }

  onPress = () => {
    const { navigate } = this.props.navigation;
    const data = this.form.getValue();

    if (data) {
      const timestamp = Date.now();
      const newCharacter = {
        key: uuidv4(),
        profile: data,
        created: timestamp,
        lastUpdated: timestamp,
      };
      navigate('SetCharacterRace', { character: newCharacter });
    }
  }

  onChange = (value) => {
    let helpText = 'Select level to view range';
    if (value && value.hasOwnProperty('level') && value.level.length > 0) {
      const level = parseInt(value.level);
      if (level === 20) {
        const min = EXPERIENCE[parseInt(level) - 1];
        helpText = `Integer >= ${min}`;
      } else if (level >= 1 && level < 20) {
        const min = EXPERIENCE[parseInt(level) - 1];
        const max = EXPERIENCE[parseInt(level)] - 1;
        helpText = `Range in [${min}, ${max}]`;
      }
    }
    let options = t.update(this.state.options, {
      fields: {
        experience: {
          help: { '$set': helpText }
        }
      }
    });
    this.setState({ options: options, form: value });
  }

  render() {
    // Update form options for focus on next field
    const fieldOrder = ['firstName', 'lastName', 'level', 'experience', 'age',
      'height', 'weight'];

    fieldOrder.forEach((fieldName, index) => {
      if (index + 1 < fieldOrder.length) {
        options.fields[fieldName].onSubmitEditing = () => {
          this.form.getComponent(fieldOrder[index + 1]).refs.input.focus();
        };
      }
    });

    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <ScrollView style={{ margin: 20 }} keyboardShouldPersistTaps="always">
            <t.form.Form
              ref={(c) => { this.form = c; }}
              type={Character}
              value={this.state.form}
              options={this.state.options}
              onChange={this.onChange}
            />
            <TouchableHighlight
              style={FormStyle.submitBtn}
              onPress={this.onPress}
              underlayColor="#1A237E"
            >
              <Text style={FormStyle.submitBtnText}>Save Character</Text>
            </TouchableHighlight>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
