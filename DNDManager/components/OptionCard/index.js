import React, { Component } from 'react';
import { Image, StyleSheet } from 'react-native'
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right
} from 'native-base';

export default class OptionCard extends Component {
  render() {
    return (
      <Container>
        <Content>
          <Card>
            <CardItem cardBody>
              <Image
                source={this.props.image}
                style={styles.cardImage}
              >
                <Text style={styles.title}>
                  {this.props.label}
                </Text>
                <Text style={styles.subtitle} note>
                  {this.props.description}
                </Text>
              </Image>
            </CardItem>
            <CardItem>
              <Body>
                <Button full primary iconLeft>
                  <Icon name={this.props.actionIcon} />
                  <Text>{this.props.actionText}</Text>
                </Button>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  cardImage: {
    height: 200,
    width: null,
    flex: 1,
    resizeMode: 'cover',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  title: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    fontSize: 28,
    marginTop: 10,
    padding: 5,
    color: '#fff'
  },
  subtitle: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 5,
    color: '#fff'
  }
});
