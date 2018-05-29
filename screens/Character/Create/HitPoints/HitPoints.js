import React from 'react';
import PropTypes from 'prop-types';
import { Keyboard, StyleSheet, View, Text } from 'react-native';
import { Container, Content } from 'native-base';
import { Button, Card, COLOR, Toolbar } from 'react-native-material-ui';
import store from 'react-native-simple-store';
import { NavigationActions, StackActions } from 'react-navigation';
import Note from 'FifthEditionManager/components/Note';
import { CLASSES, IMAGES } from 'FifthEditionManager/config/Info';
import { CardStyle, ContainerStyle, FormStyle } from 'FifthEditionManager/stylesheets';
import { ACTIVITY_KEY, CHARACTER_KEY } from 'FifthEditionManager/config/StoreKeys';
import { formatSingleDigit, validateInteger } from 'FifthEditionManager/util';
import { cloneDeep } from 'lodash';

const t = require('tcomb-form-native');
const uuidv4 = require('uuid/v4');
const Chance = require('chance');

const chance = new Chance();

/**
 * Define hit points
 */

const HitPointsType = t.struct({
  timesAverageTaken: t.Number,
});

/**
 * Form template setup
 */

const template = locals => (
  <View>
    {locals.inputs.timesAverageTaken}
  </View>
);

/**
 * Define form options
 */

const options = {
  template,
  fields: {
    timesAverageTaken: {
      label: 'Times Average Taken',
    },
  },
};

export default class HitPoints extends React.Component {
  static navigationOptions = {
    header: ({ navigation }) => {
      const { routes, index } = navigation.state;
      const props = {
        leftElement: 'arrow-back',
        onLeftElementPress: () => navigation.goBack(routes[index].key),
        centerElement: 'Review Hit Points',
      };
      return <Toolbar {...props} />;
    },
  }

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  static contextTypes = {
    uiTheme: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      timesAverageTaken: null,
      hitPoints: null,
      rolls: null,
      rollCount: 0,
      isNoteCollapsed: true,
      type: HitPointsType,
      form: null,
      options,
      ...props.navigation.state.params,
    };
    this.state.baseClass = CLASSES
      .find(option => option.key === this.state.character.baseClass.lookupKey);
  }

  componentWillMount() {
    const { level } = this.state.character.profile;
    const { hitDie } = this.state.baseClass;

    // Form options setup after considering level
    const updatedOptions = t.update(this.state.options, {
      fields: {
        timesAverageTaken: {
          help: { $set: `Range [0, ${level - 1}]` },
          placeholder: {
            $set: `Take ${(hitDie / 2) + 1} hit points, ${level - 1} ${level - 1 !== 1 ? 'times' : 'time'} max`,
          },
        },
      },
    });

    // Form validation setup after considering level
    const TimesAverageTaken = t
      .refinement(t.Number, n => n % 1 === 0 && n >= 0 && n <= level - 1);
    TimesAverageTaken.getValidationErrorMessage = value => validateInteger(
      value,
      `Must be in range [0, ${level - 1}]`,
    );
    const HitPointsEdited = t.struct({ timesAverageTaken: TimesAverageTaken });
    this.setState({ options: updatedOptions, type: HitPointsEdited });
  }

  onChange = (value) => {
    this.setState({ form: value });
  }

  onPress = () => {
    Keyboard.dismiss();
    const data = this.form.getValue();
    if (data) {
      this.setState({
        timesAverageTaken: data.timesAverageTaken,
        form: data,
      }, () => this.reroll());
    }
  }

  setHitPoints = () => {
    const { state, dispatch } = this.props.navigation;
    const { hitDie } = this.state.baseClass;
    const { modifier } = this.state.character.stats.constitution;
    const newCharacter = cloneDeep(state.params.character);
    newCharacter.meta.lastUpdated = Date.now();
    newCharacter.hitPoints = (this.state.hitPoints ? this.state.hitPoints : 0) + hitDie + modifier;

    const newActivity = {
      key: uuidv4(),
      timestamp: newCharacter.meta.lastUpdated,
      action: 'Created New Character',
      // Format character's full name for extra text
      extra: `${newCharacter.profile.firstName.charAt(0).toUpperCase()}${newCharacter.profile.firstName.slice(1)} ${newCharacter.profile.lastName.charAt(0).toUpperCase()}${newCharacter.profile.lastName.slice(1)}`,
      thumbnail: IMAGES.RACE[newCharacter.race.lookupKey],
      icon: {
        name: 'add-circle',
        color: COLOR.white,
      },
    };

    store
      .push(CHARACTER_KEY, newCharacter)
      .catch((error) => {
        // Show error message on screen and allow resubmit
        this.setState({ error });
        return error;
      })
      .then((error) => {
        if (error) return;
        store
          .push(ACTIVITY_KEY, newActivity)
          .then(() => {
            const resetAction = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({
                routeName: 'Home',
              })],
            });
            dispatch(resetAction);
          });
      });
  }

  toggleNote = () => {
    this.setState({
      isNoteCollapsed: !this.state.isNoteCollapsed,
    });
  }

  reroll = () => {
    const { timesAverageTaken } = this.state;
    const { level } = this.state.character.profile;
    const { modifier } = this.state.character.stats.constitution;
    const modifierTotal = level * modifier;
    const { hitDie } = this.state.baseClass;
    const average = (hitDie / 2) + 1;

    const rolls = [];
    const rollCount = (level - 1) - timesAverageTaken;
    for (let i = 0; i < rollCount; i += 1) {
      rolls.push(chance.natural({ min: 1, max: hitDie }));
    }
    // Add first level max roll + all other levels' rolls
    const totalRollCount = (rolls.length === 0 ? 0 : rolls.reduce((sum, x) => sum + x)) + hitDie;
    this.setState({
      rolls: rolls.slice(0),
      hitPoints: totalRollCount + (average * timesAverageTaken) + modifierTotal,
      rollCount: this.state.rollCount + 1,
    });
  }

  render() {
    // Theme setup
    const { textColor } = this.context.uiTheme.palette;
    const textStyle = { color: textColor };

    const { hitDie } = this.state.baseClass;
    const { modifier } = this.state.character.stats.constitution;
    const { level } = this.state.character.profile;
    const average = (hitDie / 2) + 1;
    const negative = modifier < 0;
    const modifierDisplay = Math.abs(modifier);

    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <View style={ContainerStyle.padded}>
            {
              this.state.error &&
              <Note
                title="Error"
                type="error"
                icon="error"
                uiTheme={this.context.uiTheme}
              >
                <Text>
                  An error was encountered while saving your character. Try again in a moment.
                </Text>
              </Note>
            }
            <Note
              title={`${this.state.character.baseClass.name} Hit Points`}
              type="info"
              icon="info"
              collapsible
              isCollapsed={this.state.isNoteCollapsed}
              toggleNoteHandler={this.toggleNote}
              uiTheme={this.context.uiTheme}
            >
              <Text style={{ marginBottom: 10 }}>
                The
                <Text style={CardStyle.makeBold}>
                  &nbsp;{this.state.character.baseClass.name}&nbsp;
                </Text>
                class grants a hit die of
                <Text style={CardStyle.makeBold}>
                  &nbsp;1d{hitDie}&nbsp;
                </Text>
                plus your constitution modifier&nbsp;
                <Text style={CardStyle.makeBold}>
                  ({negative ? <Text>&minus;</Text> : '+'}{modifierDisplay})
                </Text>
                &nbsp;per level after the first level.
                For the first level, take&nbsp;
                <Text style={CardStyle.makeBold}>
                  {hitDie} {negative ? '-' : '+'} {modifierDisplay} = {hitDie + modifier}
                </Text>
                .{'\n\n'}After every level, add a roll of&nbsp;
                <Text style={CardStyle.makeBold}>
                  1d{hitDie} {negative ? '-' : '+'} {modifierDisplay}&nbsp;
                </Text>
                or take&nbsp;
                <Text style={CardStyle.makeBold}>
                  {(hitDie / 2) + 1} {negative ? '-' : '+'}&nbsp;
                  {modifierDisplay} = {(hitDie / 2) + 1 + modifier}&nbsp;
                </Text>
                automatically.
              </Text>
            </Note>
            {
              level !== 1 &&
              <View style={FormStyle.horizontalLayout}>
                <View style={{ flex: 3, marginRight: 10 }}>
                  <t.form.Form
                    ref={(c) => { this.form = c; }}
                    type={this.state.type}
                    value={this.state.form}
                    options={this.state.options}
                    onChange={this.onChange}
                  />
                </View>
                <View style={{ flex: 1, marginTop: 30 }}>
                  <Button
                    primary
                    raised
                    text="Roll"
                    onPress={this.onPress}
                  />
                </View>
              </View>
            }
            <View
              style={[styles.buttonLayout, { marginTop: 10, marginBottom: 20 }]}
            >
              {
                level !== 1 &&
                <Button
                  accent
                  raised
                  text="Reroll"
                  onPress={() => this.reroll()}
                  disabled={
                    this.state.timesAverageTaken === null ||
                    this.state.timesAverageTaken === level - 1
                  }
                  style={{ container: { flex: 1, marginRight: 10 } }}
                />
              }
              <Button
                primary
                raised
                text="Proceed"
                onPress={() => this.setHitPoints()}
                disabled={!this.state.hitPoints && level !== 1}
                style={{ container: { flex: 1, marginLeft: 10 } }}
              />
            </View>
            <View style={styles.horizontalLayout}>
              <View style={{ alignItems: 'center' }}>
                <Text style={[styles.cardTitle, textStyle]}>
                  Times Average Taken
                </Text>
                <Card
                  style={{
                    container: {
                      width: 100,
                      height: 100,
                      padding: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                      flexWrap: 'wrap',
                    },
                  }}
                >
                  <Text style={[styles.pointText, textStyle]}>
                    {
                      this.state.timesAverageTaken === null &&
                      <Text>&mdash;</Text>
                    }
                    {
                      this.state.timesAverageTaken &&
                      this.state.timesAverageTaken
                    }
                  </Text>
                </Card>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={[styles.cardTitle, textStyle]}>
                  Hit Points
                </Text>
                <Card
                  style={{
                    container: {
                      width: 100,
                      height: 100,
                      padding: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                      flexWrap: 'wrap',
                    },
                  }}
                >
                  <Text style={[styles.pointText, textStyle]}>
                    {
                      !this.state.hitPoints &&
                      <Text>{hitDie + modifier}</Text>
                    }
                    {
                      this.state.hitPoints && this.state.hitPoints
                    }
                  </Text>
                </Card>
              </View>
            </View>
            {
              this.state.hitPoints &&
              [
                <Card key="firstLevel" style={{ container: CardStyle.containerNarrow }}>
                  <View style={styles.diceLayout}>
                    <Text style={[styles.scoreLabel, textStyle]}>
                      Level {formatSingleDigit(1)}:
                    </Text>
                    <Text style={[styles.scoreLabel, textStyle]}>
                      {hitDie} {negative ? <Text>&minus;</Text> : '+'} {modifierDisplay} =
                    </Text>
                    <Text style={[styles.scoreLabel, textStyle, CardStyle.makeBold]}>
                      {formatSingleDigit(hitDie + modifier)}
                    </Text>
                  </View>
                </Card>,
              ].concat(Array(this.state.timesAverageTaken).fill(null).map((val, rollNumber) => (
                <Card
                  key={`average-taken-${rollNumber}`} // eslint-disable-line react/no-array-index-key
                  style={{ container: CardStyle.containerNarrow }}
                >
                  <View style={styles.diceLayout}>
                    <Text style={[styles.scoreLabel, textStyle]}>
                      Level {formatSingleDigit(rollNumber + 2)}:
                    </Text>
                    <Text style={[styles.scoreLabel, textStyle]}>
                      {average} {negative ? <Text>&minus;</Text> : '+'} {modifierDisplay} =
                    </Text>
                    <Text style={[styles.scoreLabel, textStyle, CardStyle.makeBold]}>
                      {formatSingleDigit(average + modifier)}
                    </Text>
                  </View>
                </Card>
              ))).concat(this.state.rolls.map((score, rollNumber) => (
                <Card
                  key={`roll-${rollNumber}-${score}`} // eslint-disable-line react/no-array-index-key
                  style={{ container: CardStyle.containerNarrow }}
                >
                  <View style={styles.diceLayout}>
                    <Text style={[styles.scoreLabel, textStyle]}>
                      Level {formatSingleDigit(rollNumber + 2 + this.state.timesAverageTaken)}:
                    </Text>
                    <Text style={[styles.scoreLabel, textStyle]}>
                      {score} {negative ? <Text>&minus;</Text> : '+'} {modifierDisplay} =
                    </Text>
                    <Text style={[styles.scoreLabel, textStyle, CardStyle.makeBold]}>
                      {formatSingleDigit(score + modifier)}
                    </Text>
                  </View>
                </Card>
              ))).concat([
                <Card key="hit-points-total" style={{ container: CardStyle.containerNarrow }}>
                  <View style={styles.diceLayout}>
                    <Text style={[styles.scoreLabel, textStyle]}>
                    Total Hit Points:
                    </Text>
                    <Text style={[styles.scoreLabel, textStyle, CardStyle.makeBold]}>
                      {formatSingleDigit(this.state.hitPoints)}
                    </Text>
                  </View>
                </Card>,
              ])
            }
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  horizontalLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  diceLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  scoreLabel: {
    fontFamily: 'RobotoLight',
    color: COLOR.black,
    fontSize: 24,
  },
  cardTitle: {
    fontFamily: 'RobotoLight',
    color: COLOR.black,
    fontSize: 18,
    marginBottom: 10,
  },
  pointText: {
    fontFamily: 'RobotoBold',
    color: COLOR.black,
    fontSize: 28,
  },
});
