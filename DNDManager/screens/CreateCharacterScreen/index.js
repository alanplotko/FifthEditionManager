import React from 'react';
import { StyleSheet, TouchableHighlight, Text, View } from 'react-native';
import { Container, Content }
  from 'native-base';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';
import t from 'tcomb-form-native';

/**
 * Form valdiation setup
 */

// Integer in range [1, 20]
const Level = t.refinement(t.Number, n => n % 1 === 0 && n > 0 && n <= 20);
Level.getValidationErrorMessage = (value) => {
  if (!value) return 'Required field';
  return (value % 1 !== 0) ?
    'Level must be a valid integer' :
    'Level must be in range [1, 20]';
};

// Integer >= 0
const Experience = t.refinement(t.Number, n => n % 1 === 0 && n >= 0);
Experience.getValidationErrorMessage = (value) => {
  if (!value) return 'Required field';
  return (value % 1 !== 0) ?
    'Experience points must be a valid integer' :
    'Experience points must be 0 or greater';
};

const defaultError = () => 'Required field';
t.Number.getValidationErrorMessage = defaultError;
t.String.getValidationErrorMessage = defaultError;

/**
 * Define character and form options
 */

const Character = t.struct({
  firstName: t.String,
  lastName: t.String,
  level: Level,
  experience: Experience,
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
  age: t.Number,
  height: t.String,
  weight: t.String,
});

const options = {
  fields: {
    firstName: {
      label: 'First Name',
    },
    lastName: {
      label: 'Last Name',
    },
    experience: {
      label: 'Experience Points',
    },
    gender: {
      nullOption: { value: '', text: 'Select Gender' },
    },
    alignment: {
      nullOption: { value: '', text: 'Select Alignment' },
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
      console.log(data);
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
  separator: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  twoColLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  input: {
    flex: 0.5,
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});
