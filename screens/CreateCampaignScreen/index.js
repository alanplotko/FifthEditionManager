import React from 'react';
// import { StyleSheet } from 'react-native';
import { Container, Content, Form, Item, Input, Label } from 'native-base';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';

export default class CreateCampaignScreen extends React.Component {
  static navigationOptions = {
    title: 'New Campaign',
  }

  render() {
    return (
      <Container style={[ContainerStyle.parent, ContainerStyle.padded]}>
        <Content>
          <Form>
            <Item stackedLabel>
              <Label>Campaign Name</Label>
              <Input />
            </Item>
          </Form>
        </Content>
      </Container>
    );
  }
}

// const styles = StyleSheet.create({});
