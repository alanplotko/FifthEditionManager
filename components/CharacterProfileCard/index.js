import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Card, CardItem, Text, Body, Left, Right } from 'native-base';
import { Avatar, COLOR, Icon, IconToggle, ListItem }
  from 'react-native-material-ui';
import { StyleSheet, Image, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { EXPERIENCE } from 'DNDManager/config/Info';
import { getCharacterDisplayName } from 'DNDManager/util';

const calculateLevelProgress = (level, experience) => (
  level < 20 ? experience / EXPERIENCE[level] : 1
);

const formatNumber = num => (
  num > 999 ? `${(num / 1000).toFixed(1)}k` : num
);

const navItem = {
  container: {
    margin: 0,
    height: 50,
  },
  leftElementContainer: {
    marginRight: -10,
  },
};

const navHeader = Object.assign({}, navItem, {
  container: {
    margin: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.grey300,
    height: 55,
  },
  contentViewContainer: {
    backgroundColor: COLOR.grey50,
  },
});

const navText = {
  fontFamily: 'Roboto',
  fontSize: 14,
  color: '#000',
};

const CharacterProfileCard = (props) => {
  const modalContent = (
    <View style={{ margin: 0 }}>
      <ListItem
        leftElement={
          <View>
            <Avatar
              image={
                <Image
                  source={props.character.profile.images.race}
                  style={{ height: 24, width: 24, borderRadius: 12 }}
                />
              }
              size={24}
            />
          </View>
        }
        centerElement={
          <Text style={{ fontFamily: 'Roboto', fontSize: 14, color: '#000' }}>
            {getCharacterDisplayName(props.character)}
          </Text>
        }
        style={navHeader}
      />
      <ListItem
        leftElement={<Icon name="open-in-new" color={COLOR.grey600} />}
        centerElement={
          <Text style={navText}>View Character</Text>
        }
        onPress={() => props.viewHandler(props.character.key)}
        style={navItem}
      />
      <ListItem
        leftElement={<Icon name="mode-edit" color={COLOR.grey600} />}
        centerElement={
          <Text style={navText}>Edit Character</Text>
        }
        onPress={() => props.editHandler(props.character.key)}
        style={navItem}
      />
      <ListItem
        leftElement={<Icon name="delete" color={COLOR.grey600} />}
        centerElement={
          <Text style={navText}>Delete Character</Text>
        }
        onPress={() => props.deleteHandler(props.character)}
        style={navItem}
      />
    </View>
  );

  return (
    <Card style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
      <CardItem cardBody>
        <Image
          source={props.character.profile.images.race}
          resizeMode="cover"
          style={{ height: 100, width: null, flex: 1 }}
        />
        <View style={{ position: 'absolute', top: 0, right: 0 }}>
          <IconToggle
            name="more-vert"
            color="#fff"
            onPress={() => props.modalHandler(modalContent)}
          />
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
            resizeMode="contain"
          />
          <Body>
            <Text style={styles.heading} numberOfLines={1}>
              {getCharacterDisplayName(props.character)}&nbsp;
            </Text>
            <Text style={styles.subheading}>
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
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={styles.levelText}>
              Level {props.character.profile.level}
            </Text>
            <Progress.Bar
              progress={calculateLevelProgress(
                props.character.profile.level,
                props.character.profile.experience,
              )}
              animated={false}
              color="#3F51B5"
              borderColor="#3F51B5"
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
};

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
  lastUpdatedBanner: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 3,
    paddingBottom: 3,
    color: '#fff',
    fontFamily: 'Roboto',
    fontStyle: 'italic',
    fontSize: 12,
    borderTopLeftRadius: 5,
  },
});

CharacterProfileCard.propTypes = {
  character: PropTypes.object,
  modalHandler: PropTypes.func,
  viewHandler: PropTypes.func,
  editHandler: PropTypes.func,
  deleteHandler: PropTypes.func,
};

CharacterProfileCard.defaultProps = {
  character: undefined,
  modalHandler: () => null,
  viewHandler: () => null,
  editHandler: () => null,
  deleteHandler: () => null,
};

export default CharacterProfileCard;
