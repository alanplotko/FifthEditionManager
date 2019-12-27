import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Card, CardItem, Text, Body, Left, Right } from 'native-base';
import { COLOR, Icon, IconToggle, ListItem, ThemeContext } from 'react-native-material-ui';
import { StyleSheet, Image, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { EXPERIENCE, IMAGES } from 'FifthEditionManager/config/Info';
import { getCharacterDisplayName } from 'FifthEditionManager/util';

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
  color: COLOR.black,
};

const CharacterProfileCard = (props) => {
  const modalContent = (
    <ThemeContext.Consumer>
      {theme => (
        <View style={{ margin: 0 }}>
          <ListItem
            leftElement={
              <Image
                source={IMAGES.RACE[props.character.race.lookupKey]}
                style={{ height: 36, width: 36 }}
                resizeMode="contain"
              />
            }
            centerElement={
              <Text style={[styles.characterName, { color: theme.palette.textColor }]}>
                {getCharacterDisplayName(props.character)}
              </Text>
            }
            style={navHeader}
          />
          <ListItem
            leftElement={<Icon name="open-in-new" color={theme.palette.iconColor} />}
            centerElement={
              <Text style={navText}>View Character</Text>
            }
            onPress={() => props.viewHandler(props.character.key)}
            style={navItem}
          />
          <ListItem
            leftElement={<Icon name="mode-edit" color={theme.palette.iconColor} />}
            centerElement={
              <Text style={navText}>Edit Character</Text>
            }
            onPress={() => props.editHandler(props.character.key)}
            style={navItem}
          />
          <ListItem
            leftElement={<Icon name="delete" color={theme.palette.iconColor} />}
            centerElement={
              <Text style={navText}>Delete Character</Text>
            }
            onPress={() => props.deleteHandler(props.character)}
            style={navItem}
          />
        </View>
      )}
    </ThemeContext.Consumer>
  );

  return (
    <ThemeContext.Consumer>
      {theme => (
        <Card style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
          <CardItem cardBody>
            <Image
              source={IMAGES.RACE[props.character.race.lookupKey]}
              style={{ height: 100, width: null, flex: 1 }}
            />
            <View style={{ position: 'absolute', top: 0, right: 0 }}>
              <IconToggle
                name="more-vert"
                color={COLOR.white}
                onPress={() => props.modalHandler(modalContent)}
              />
            </View>
            <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
              <Text
                style={[
                  styles.lastUpdatedBanner,
                  { backgroundColor: theme.palette.fadedBackgroundColor },
                ]}
              >
                Last updated {moment(props.character.meta.lastUpdated).fromNow()}
              </Text>
            </View>
          </CardItem>
          <CardItem>
            <Left style={{ flex: 2 }}>
              <Image
                source={IMAGES.BASE_CLASS.ICON[props.character.baseClass.lookupKey]}
                style={{ width: 48, height: 64 }}
                resizeMode="contain"
              />
              <Body>
                <Text
                  style={[
                    styles.heading,
                    { color: theme.palette.textColor },
                  ]}
                  numberOfLines={1}
                >
                  {getCharacterDisplayName(props.character)}&nbsp;
                </Text>
                <Text style={[styles.subheading, { color: theme.palette.noteColor }]}>
                  {props.character.race.name}&nbsp;
                  {props.character.baseClass.name}
                </Text>
                <Text style={[styles.subheading, { color: theme.palette.noteColor }]}>
                  {props.character.background.name}
                </Text>
              </Body>
            </Left>
            <Right style={{ flex: 1 }}>
              <View
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              >
                <Text style={[styles.levelText, { color: theme.palette.noteColor }]}>
                  Level {props.character.profile.level}
                </Text>
                <Progress.Bar
                  progress={calculateLevelProgress(
                    props.character.profile.level,
                    props.character.profile.experience,
                  )}
                  animated={false}
                  color={theme.palette.primaryColor}
                  borderColor={theme.palette.primaryColor}
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
      )}
    </ThemeContext.Consumer>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontFamily: 'RobotoLight',
    fontSize: 18,
    color: COLOR.black,
    width: 175,
  },
  subheading: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: COLOR.grey500,
  },
  characterName: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: COLOR.black,
  },
  levelText: {
    fontFamily: 'RobotoLight',
    fontSize: 16,
    color: COLOR.grey500,
  },
  experienceText: {
    fontFamily: 'RobotoLight',
    fontSize: 14,
    color: COLOR.grey500,
  },
  lastUpdatedBanner: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 3,
    paddingBottom: 3,
    color: COLOR.white,
    fontFamily: 'Roboto',
    fontStyle: 'italic',
    fontSize: 12,
    borderTopLeftRadius: 5,
  },
});

CharacterProfileCard.propTypes = {
  character: PropTypes.object.isRequired,
  modalHandler: PropTypes.func.isRequired,
  viewHandler: PropTypes.func.isRequired,
  editHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
};

export default CharacterProfileCard;
