import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Card, CardItem, Text, Left, Body } from 'native-base';
import { StyleSheet, Image, View } from 'react-native';
import { Icon } from 'react-native-material-ui';

const ActivityCard = props => (
  <Card style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
    <CardItem cardBody>
      <Left>
        <View>
          <Image
            style={styles.thumbnail}
            resizeMode="cover"
            source={props.activity.thumbnail}
            blurRadius={props.activity.icon ? 10 : 0}
          />
          {
            props.activity.icon &&
            <Icon
              name={props.activity.icon.name}
              color={props.activity.icon.color}
              size={48}
              style={{ position: 'absolute', top: 12, left: 12 }}
            />
          }
        </View>
        <Body style={{ paddingLeft: 10 }}>
          <Text style={styles.heading}>
            {props.activity.action}
          </Text>
          <Text style={styles.subheading}>
            {props.activity.extra}&nbsp;&bull;&nbsp;
            {moment(props.activity.timestamp).fromNow()}
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
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
});

ActivityCard.propTypes = {
  activity: PropTypes.shape({
    thumbnail: PropTypes.number,
    action: PropTypes.string,
    extra: PropTypes.string,
    timestamp: PropTypes.number,
    icon: PropTypes.shape({
      name: PropTypes.string,
      color: PropTypes.string,
    })
  }),
};

ActivityCard.defaultProps = {
  activity: undefined,
};

export default ActivityCard;