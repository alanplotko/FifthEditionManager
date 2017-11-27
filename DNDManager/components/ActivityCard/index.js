import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardItem, Text, Body } from 'native-base';
import { StyleSheet } from 'react-native';

const ActivityCard = props => (
  <Card>
    <CardItem header>
      {
        props.header &&
        <Text style={styles.header}>{props.header}</Text>
      }
    </CardItem>
    <CardItem>
      {
        props.body &&
        <Body>
          <Text style={styles.body}>{props.body}</Text>
        </Body>
      }
    </CardItem>
    <CardItem footer>
      {
        props.footer &&
        <Text>{props.footer}</Text>
      }
    </CardItem>
  </Card>
);

const styles = StyleSheet.create({
  header: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    fontSize: 18,
  },
  body: {
    fontFamily: 'Roboto',
    fontSize: 16,
  },
});

ActivityCard.propTypes = {
  header: PropTypes.string,
  body: PropTypes.string,
  footer: PropTypes.string,
};

ActivityCard.defaultProps = {
  header: undefined,
  body: undefined,
  footer: undefined,
};

export default ActivityCard;
