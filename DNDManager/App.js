import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import Loader from './components/Loader';
import Navigation from './components/Navigation';
import store from 'react-native-simple-store';

const PROFILE_KEY = "@DNDManager:profile";

export default class App extends Component {
  async componentDidMount() {
    try {
      const profile = await store.get(PROFILE_KEY);
      if (profile !== null) {
        this.setState({profile});
      }
    } catch (error) {
      console.error('Store error (fetch profile): ' + error.message);
    } finally {
      this.setState({isLoading: false});;
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      nameInput: ''
    };
  }

  setUpProfile() {
    let profile = { name: this.state.nameInput };
    try {
      store.save(PROFILE_KEY, profile);
    } catch (error) {
      console.error('Store error (profile setup): ' + error.message);
    } finally {
      this.setState({profile});
    }
  }

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
          <Navigation />
          <Text>Welcome back, {this.state.profile.name}!</Text>
        </View>
      );
    }

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
      >
        <View style={[styles.container, styles.centerScreen]}>
          <Text style={styles.baseText}>You must be new here.</Text>
          <Text style={styles.baseText}>What do you go by?</Text>
          <TextInput
            label={'Name'}
            style={styles.textInput}
            value={this.state.nameInput}
            placeholder='Name'
            onChangeText={(nameInput) => this.setState({nameInput})}
            onSubmitEditing={() => this.setUpProfile()}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'Roboto',
    fontSize: 18
  },
  textInput: {
    paddingLeft: 10,
    fontSize: 18,
    width: '75%',
    height: 60,
    marginTop: 20
  },
  container: {
    flex: 1,
    backgroundColor: '#eee'
  },
  centerScreen: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
