import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Card, CardItem, Text, Left, Body } from 'native-base';
import { StyleSheet, Image, View } from 'react-native';
import { Icon } from 'react-native-material-ui';
import DefaultTheme from 'FifthEditionManager/themes/DefaultTheme';

// Styles
const activityIconStyle = { position: 'absolute', top: 12, left: 12 };

const ActivityCard = (props) => {
  if (!props.activity) return null;

  // Theme setup
  const headingColor = { color: props.uiTheme.palette.textColor };
  const noteColor = { color: props.uiTheme.palette.noteColor };

  return (
    <Card style={styles.card}>
      <CardItem cardBody>
        <Left>
          <View>
            {
              props.activity.thumbnail &&
              <Image
                style={styles.thumbnail}
                resizeMode="cover"
                source={props.activity.thumbnail}
                blurRadius={props.activity.icon ? 10 : 0}
              />
            }
            {
              props.activity.icon &&
              <Icon
                name={props.activity.icon.name}
                color={props.activity.icon.color}
                size={48}
                style={activityIconStyle}
              />
            }
          </View>
          <Body style={styles.cardBody}>
            <Text style={[styles.heading, headingColor]}>
              {props.activity.action}
            </Text>
            <Text style={[styles.subheading, noteColor]}>
              {props.activity.extra.trim()}&nbsp;&bull;&nbsp;
              {moment(props.activity.timestamp).fromNow()}
            </Text>
          </Body>
        </Left>
      </CardItem>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  cardBody: {
    paddingLeft: 10,
  },
  heading: {
    fontFamily: 'RobotoLight',
    fontSize: 18,
  },
  subheading: {
    fontFamily: 'Roboto',
    fontSize: 14,
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
    }),
  }).isRequired,
  uiTheme: PropTypes.object,
};

ActivityCard.defaultProps = {
  uiTheme: DefaultTheme,
};

export default ActivityCard;
