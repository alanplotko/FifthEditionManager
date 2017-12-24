import React from 'react';
import { StyleSheet, TouchableHighlight, Text, View } from 'react-native';
import { Container, Content } from 'native-base';
import store from 'react-native-simple-store';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';
import { CHARACTER_KEY } from 'DNDManager/config/StoreKeys';

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
Experience.getValidationErrorMessage = (value) => {
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
      <Text style={styles.heading}>Character Name</Text>
      <View style={styles.horizontalLayout}>
        <View style={{ flex: 1, marginRight: 5 }}>
          {locals.inputs.firstName}
        </View>
        <View style={{ flex: 1, marginLeft: 5 }}>
          {locals.inputs.lastName}
        </View>
      </View>

      <Text style={styles.heading}>Power</Text>
      <View style={styles.horizontalLayout}>
        <View style={{ flex: 1, marginRight: 5 }}>
          {locals.inputs.level}
        </View>
        <View style={{ flex: 1, marginLeft: 5 }}>
          {locals.inputs.experience}
        </View>
      </View>

      <Text style={styles.heading}>About</Text>
      <View style={styles.horizontalLayout}>
        <View style={{ flex: 1 }}>
          {locals.inputs.gender}
        </View>
        <View style={{ flex: 1 }}>
          {locals.inputs.alignment}
        </View>
      </View>

      <Text style={styles.heading}>Measurements</Text>
      <View style={styles.horizontalLayout}>
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
      placeholder: 'Integer, 0 or up',
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

  onPress = () => {
    const data = this.form.getValue();
    if (data) {
      store.push(CHARACTER_KEY, {
        key: uuidv4(),
        profile: data,
      }).catch(error => {
        // TODO: Show error message on screen and allow resubmit
    		console.error(error);
    	});
    }
  }

  render() {
    return (
      <Container style={ContainerStyle.parent}>
        <Content keyboardShouldPersistTaps="always">
          <View style={{ margin: 20 }}>
            <t.form.Form
              ref={(c) => { this.form = c; }}
              type={Character}
              options={options}
            />
            <TouchableHighlight
              style={styles.submitBtn}
              onPress={this.onPress}
              underlayColor="#99d9f4"
            >
              <Text style={styles.submitBtnText}>Save Character</Text>
            </TouchableHighlight>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontFamily: 'Roboto',
    color: '#000',
    borderBottomWidth: 0.5,
    borderBottomColor: '#999',
    marginBottom: 20,
  },
  horizontalLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitBtnText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
  submitBtn: {
    height: 48,
    backgroundColor: '#3F51B5',
    borderColor: '#3F51B5',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});
