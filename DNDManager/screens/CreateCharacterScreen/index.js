import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, Form, Item, Input, Label } from 'native-base';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';

export default class CreateCharacterScreen extends Component {
  static navigationOptions = {
    title: 'New Character'
  }

  render() {
    return (
        <Container style={ContainerStyle.paddedContainer}>
          <Content>
            <Form>
              <Item stackedLabel>
                <Label>Character Name</Label>
                <Input />
              </Item>
            </Form>
          </Content>
        </Container>
    );
  }
}

var styles = StyleSheet.create({
});
