import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Button, Card, CardItem, Text, Icon, Body, Left, Right, Thumbnail }
  from 'native-base';
import { StyleSheet, Image, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { EXPERIENCE } from 'DNDManager/config/Info';

const calculateLevelProgress = (level, experience) => {
  return level < 20 ? experience / EXPERIENCE[level] : 1;
};

const toTitleCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const formatNumber = num => num > 999 ? (num / 1000).toFixed(1) + 'k' : num;

const CharacterProfileCard = props => (
  <Card style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
    <CardItem cardBody>
      <Image
        source={props.character.profile.images.race}
        resizeMode='cover'
        style={{ height: 120, width: null, flex: 1 }}
      />
      <View style={{ position: 'absolute', top: 0, right: 0 }}>
        <Button transparent>
          <Icon name='more' style={{ color: '#fff' }} />
        </Button>
      </View>
      <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
        <Text style={styles.lastUpdatedBanner}>
          Last updated {moment(props.character.lastUpdated).fromNow()}
        </Text>
      </View>
    </CardItem>
    <CardItem>
      <Left style={{ flex: 2 }}>
        <Image
          source={props.character.profile.images.baseClass}
          style={{ width: 48, height: 64 }}
          resizeMode='contain'
        />
        <Body>
          <Text style={styles.heading} numberOfLines={1}>
            {toTitleCase(props.character.profile.firstName)}&nbsp;
            {toTitleCase(props.character.profile.lastName)}&nbsp;
          </Text>
          <Text style={styles.subheading}>
            <Icon
              name={props.character.profile.gender.toLowerCase()}
              style={styles.genderIcon}
            />&nbsp;
            {props.character.profile.race}&nbsp;
            {props.character.profile.baseClass}
          </Text>
          <Text style={styles.subheading}>
            {props.character.profile.background}
          </Text>
        </Body>
      </Left>
      <Right style={{ flex: 1 }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}
        >
          <Text style={styles.levelText}>
            Level {props.character.profile.level}
          </Text>
          <Progress.Bar
            progress={calculateLevelProgress(
              props.character.profile.level,
              props.character.profile.experience
            )}
            animated={false}
            color='#3F51B5'
            borderColor='#3F51B5'
            width={100}
            style={{ marginTop: 3, marginBottom: 3 }}
          />
          {
            props.character.profile.level < 20 &&
            <Text style={styles.experienceText}>
              {formatNumber(props.character.profile.experience)} /&nbsp;
              {formatNumber(EXPERIENCE[props.character.profile.level])}
            </Text>
          }
          {
            props.character.profile.level === 20 &&
            <Text style={styles.experienceText}>
              {formatNumber(props.character.profile.experience)}
            </Text>
          }
        </View>
      </Right>
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
  genderIcon: {
    fontSize: 14,
    color: '#999',
  },
  levelText: {
    fontFamily: 'RobotoLight',
    fontSize: 16,
    color: '#999',
  },
  experienceText: {
    fontFamily: 'RobotoLight',
    fontSize: 14,
    color: '#999',
  },
  nameBanner: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 5,
    color: '#fff',
    fontFamily: 'Roboto',
    fontSize: 24,
  },
  lastUpdatedBanner: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 5,
    color: '#fff',
    fontFamily: 'Roboto',
    fontStyle: 'italic',
    fontSize: 14,
  },
});

CharacterProfileCard.propTypes = {
  character: PropTypes.object,
};

CharacterProfileCard.defaultProps = {
  character: undefined,
};

export default CharacterProfileCard;
