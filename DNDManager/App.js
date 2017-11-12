import React from 'react';
import {
  AsyncStorage,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import Loader from './components/Loader';

const PROFILE_KEY = "@DNDManager:profile";

export default class App extends React.Component {
  async componentDidMount() {
    let stateCopy = Object.assign({}, this.state);
    try {
      const profile = await AsyncStorage.getItem(PROFILE_KEY);
      await AsyncStorage.removeItem(PROFILE_KEY);
      if (profile !== null) {
        stateCopy.profile = JSON.parse(profile);
      }
    } catch (error) {
      console.error('AsyncStorage error (fetch profile): ' + error.message);
    } finally {
      stateCopy.isLoading = false;
      this.setState(stateCopy);
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      nameInput: ''
    };
  };

  async setUpProfile() {
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify({
        name: this.state.nameInput
      }));
    } catch (error) {
      console.error('AsyncStorage error (profile setup): ' + error.message);
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <Loader />
        </View>
      );
    }

    if (this.state.profile) {
      return (
        <View style={styles.container}>
          <Text>Welcome back, {this.state.profile.name}!</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.baseText}>You must be new here.</Text>
        <Text style={styles.baseText}>What do you go by?</Text>
        <TextInput
          style={styles.nameInput}
          placeholder='Name'
          onChangeText={(nameInput) => this.setState({nameInput})}
          value={this.state.nameInput}
          onSubmitEditing={() => this.setUpProfile()}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'Roboto',
    fontSize: 18
  },
  nameInput: {
    height: 50
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
