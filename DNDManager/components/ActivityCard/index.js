import React, { Component } from 'react';
import {
  Container,
  Content,
  Card,
  CardItem,
  Text,
  Body
} from 'native-base';
import { StyleSheet } from 'react-native';

export default class ActivityCard extends Component {
  render() {
    return (
      <Container>
        <Content>
          <Card>
            <CardItem header>
              {
                this.props.header &&
                <Text style={styles.header}>{this.props.header}</Text>
              }
            </CardItem>
            <CardItem>
              {
                this.props.body &&
                <Body>
                  <Text style={styles.body}>{this.props.body}</Text>
                </Body>
              }
            </CardItem>
            <CardItem footer>
              {
                this.props.footer &&
                <Text>{this.props.footer}</Text>
              }
            </CardItem>
         </Card>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    fontSize: 18
  },
  body: {
    fontFamily: 'Roboto',
    fontSize: 16
  }
});
