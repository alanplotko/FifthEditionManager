import React from 'react';
import { StyleSheet, TouchableHighlight, Text, View } from 'react-native';
import { Container, Content, Item, Input, Label, Separator }
  from 'native-base';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';

const t = require('tcomb-form-native');
const Form = t.form.Form;
const Character = t.struct({
  firstName: t.String,
  lastName: t.String,
  level: t.Number,
  experiencePoints: t.Number,
  gender: t.enums({
    'Male': 'Male',
    'Female': 'Female',
    'Other': 'Other',
  }),
  alignment: t.enums({
    'Lawful Good': 'Lawful Good',
    'Neutral Good': 'Neutral Good',
    'Chaotic Good': 'Chaotic Good',
    'Lawful Neutral': 'Lawful Neutral',
    'Neutral Neutral': 'Neutral Neutral',
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
    firstName: { label: 'First Name' },
    lastName: { label: 'Last Name' },
    experiencePoints: { label: 'Experience Points' },
    gender: {
      nullOption: { value: '', text: 'Select Gender' },
    },
    alignment: {
      nullOption: { value: '', text: 'Select Alignment' },
    },
  }
};


export default class CreateCharacterScreen extends React.Component {
  static navigationOptions = {
    title: 'New Character',
  }

  onPress() {
    // call getValue() to get the values of the form
    var value = this.refs.form.getValue();
    if (value) { // if validation fails, value will be null
      console.log(value); // value here is an instance of Charcater
    }
  }

  render() {
    return (
      <Container style={ContainerStyle.parent}>
        <Content keyboardShouldPersistTaps='always'>
          <View style={{ margin: 20 }}>
            <Form ref='form' type={Character} options={options} />
            <TouchableHighlight
              style={styles.button}
              onPress={this.onPress.bind(this)}
              underlayColor='#99d9f4'
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
    paddingBottom: 10
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
