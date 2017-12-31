import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Button, Card, CardItem, Text, Icon, Left, Body }
  from 'native-base';
import { StyleSheet, Image, View } from 'react-native';

const ActivityCard = props => (
  <Card style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
    <CardItem>
      <Left>
        <Image
          style={styles.thumbnail}
          resizeMode="cover"
          source={props.activity.thumbnail}
        />
        <Body>
          <Text style={styles.heading}>
            {props.activity.action}
          </Text>
          <Text style={styles.subheading}>
            {props.activity.extra}&nbsp;&bull;&nbsp;
            {moment(props.activity.timestamp).fromNow()}
          </Text>
          <Text style={styles.timestampText}>
          </Text>
        </Body>
      </Left>
    </CardItem>
  </Card>
);

const styles = StyleSheet.create({
  heading: {
    fontFamily: 'RobotoLight',
    fontSize: 18,
    color: '#000',
  },
  subheading: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#999',
  },
  thumbnail: {
    height: 72,
    width: 72,
  },
});

ActivityCard.propTypes = {
  character: PropTypes.object,
};

ActivityCard.defaultProps = {
  character: undefined,
};

export default ActivityCard;
