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

// Integer in range [1, 20]
const Level = t.refinement(t.Number, n => n % 1 === 0 && n > 0 && n <= 20);
Level.getValidationErrorMessage = (value) => {
  if (value === null || value === undefined) return 'Required';
  return (value % 1 !== 0) ?
    'Integer only' :
    'Range [1, 20]';
};

// Integer >= 0
const Experience = t.refinement(t.Number, n => n % 1 === 0 && n >= 0);
Experience.getValidationErrorMessage = (value) => {
  if (value === null || value === undefined) return 'Required';
  return (value % 1 !== 0) ?
    'Integer only' :
    'Minimum of 0';
};

// Integer >= 1
const Age = t.refinement(t.Number, n => n % 1 === 0 && n >= 1);
Age.getValidationErrorMessage = (value) => {
  if (value === null || value === undefined) return 'Required';
  return (value % 1 !== 0) ?
    'Integer only' :
    'Minimum of 1';
};

const defaultError = () => 'Required';
t.Number.getValidationErrorMessage = defaultError;
t.String.getValidationErrorMessage = defaultError;

/**
 * Define character and form options
 */

const Name = t.struct({
 firstName: t.String,
 lastName: t.String,
});

const Skill = t.struct({
  level: Level,
  experience: Experience,
});

const Selects = t.struct({
  gender: t.enums({
    Male: 'Male',
    Female: 'Female',
    Other: 'Other',
  }),
  alignment: t.enums({
    'Lawful Good': 'Lawful Good',
    'Neutral Good': 'Neutral Good',
    'Chaotic Good': 'Chaotic Good',
    'Lawful Neutral': 'Lawful Neutral',
    'True Neutral': 'True Neutral',
    'Chaotic Neutral': 'Chaotic Neutral',
    'Lawful Evil': 'Lawful Evil',
    'Neutral Evil': 'Neutral Evil',
    'Chaotic Evil': 'Chaotic Evil',
  }),
});

const Body = t.struct({
  age: Age,
  height: t.String,
  weight: t.String,
});

const Character = t.struct({
  name: Name,
  skill: Skill,
  selects: Selects,
  body: Body,
});

const fieldsetStyle = _.cloneDeep(t.form.Form.stylesheet);
fieldsetStyle.fieldset.flexDirection = 'row';
fieldsetStyle.fieldset.justifyContent = 'space-around';
fieldsetStyle.fieldset.alignItems = 'center';
fieldsetStyle.formGroup.normal.flex = 1;
fieldsetStyle.formGroup.error.flex = 1;
fieldsetStyle.formGroup.normal.marginBottom = 25;
fieldsetStyle.formGroup.error.marginBottom = 25;
fieldsetStyle.textbox.normal.marginRight = 5;
fieldsetStyle.textbox.error.marginRight = 5;
fieldsetStyle.controlLabel.normal.marginRight = 5;
fieldsetStyle.controlLabel.error.marginRight = 5;

const options = {
  fields: {
    name: {
      auto: 'none',
      stylesheet: fieldsetStyle,
      fields: {
        firstName: {
          label: 'First Name',
        },
        lastName: {
          label: 'Last Name',
        },
      },
    },
    skill: {
      auto: 'none',
      stylesheet: fieldsetStyle,
      fields: {
        level: {
          label: 'Level',
        },
        experience: {
          label: 'Experience Points',
        },
      },
    },
    selects: {
      auto: 'none',
      stylesheet: fieldsetStyle,
      fields: {
        gender: {
          label: 'Gender',
          nullOption: { value: '', text: 'Select Gender' },
        },
        alignment: {
          label: 'Alignment',
          nullOption: { value: '', text: 'Select Alignment' },
        },
      },
    },
    body: {
      auto: 'none',
      stylesheet: fieldsetStyle,
      fields: {
        age: {
          label: 'Age',
          placeholder: 'In years',
        },
        height: {
          label: 'Height',
        },
        weight: {
          label: 'Weight',
        },
      },
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
        profile: {
          firstName: data.name.firstName,
          lastName: data.name.lastName,
          alignment: data.selects.alignment,
          gender: data.selects.gender,
          experience: data.skill.experience,
          level: data.skill.level,
          age: data.body.age,
          height: data.body.height,
          weight: data.body.weight,
        },
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
              style={styles.button}
              onPress={this.onPress}
              underlayColor="#99d9f4"
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableHighlight>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
  button: {
    height: 48,
    backgroundColor: '#3F51B5',
    borderColor: '#3F51B5',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});
