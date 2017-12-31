import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Button, Card, CardItem, Text, Icon, Body }
  from 'native-base';
import { StyleSheet, Image, View } from 'react-native';

const ActivityCard = props => (
  <Card style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
    <CardItem cardBody>
      <Image
        source={props.activity.thumbnail}
        resizeMode='cover'
        style={{ height: 120, width: 120, flex: 1 }}
      />
      <View style={{ position: 'absolute', top: 0, right: 0 }}>
        <Button transparent>
          <Icon name='more' style={{ color: '#fff' }} />
        </Button>
      </View>
    </CardItem>
    <CardItem>
      <Body>
        <Text style={styles.heading}>
          {props.activity.action} {moment(props.activity.timestamp).fromNow()}
        </Text>
        <Text style={styles.subheading}>
          {props.activity.extra}
        </Text>
      </Body>
    </CardItem>
  </Card>
);

const styles = StyleSheet.create({
  heading: {
    fontFamily: 'RobotoLight',
    fontSize: 18,
    color: '#000',
    width: 175,
  },
  subheading: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#999',
  },
});

ActivityCard.propTypes = {
  character: PropTypes.object,
};

ActivityCard.defaultProps = {
  character: undefined,
};

export default ActivityCard;
