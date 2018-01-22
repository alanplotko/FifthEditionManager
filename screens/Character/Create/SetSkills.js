import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableHighlight, View, Text } from 'react-native';
import { Container, Content } from 'native-base';
import { Card, COLOR, IconToggle, ListItem, Toolbar }
  from 'react-native-material-ui';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';
import { BASE_SKILLS } from 'DNDManager/config/Info';
import { formatSingleDigit, toTitleCase } from 'DNDManager/util';
import { cloneDeep } from 'lodash';

export default class SetSkills extends React.Component {
  static navigationOptions = {
    header: ({ navigation }) => {
      const props = {
        leftElement: 'arrow-back',
        onLeftElementPress: () => navigation.goBack(),
        centerElement: 'Set Skills',
      };
      return <Toolbar {...props} />;
    },
  }

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      skills: cloneDeep(BASE_SKILLS),
      ...props.navigation.state.params,
    };
    // TODO: remove after development
    this.state.character = {};
    this.state.character.proficiency = 2;
    this.state.character.profile = {};
    this.state.character.profile.stats = {
      strength: {
        score: 15,
        modifier: 2,
        total: 17,
      },
      dexterity: {
        score: 14,
        modifier: 2,
        total: 16,
      },
      constitution: {
        score: 13,
        modifier: 1,
        total: 14,
      },
      intelligence: {
        score: 12,
        modifier: 1,
        total: 13,
      },
      wisdom: {
        score: 10,
        modifier: 0,
        total: 10,
      },
      charisma: {
        score: 8,
        modifier: -1,
        total: 7,
      },
    };
    this.setBaseSkills(this.state.skills);
  }

  // acceptRolls = () => {
  //   const { navigate, state } = this.props.navigation;
  //   navigate('AssignAbilityScores', {
  //     scores: this.state.scores,
  //     ...state.params,
  //   });
  // }

  setBaseSkills = (skills) => {
    Object.entries(skills).forEach((skill) => {
      skills[skill[0]].modifier =
        this.state.character.profile.stats[skill[1].ability].modifier;
    });
  }

  resetSkills = () => {
    const skills = cloneDeep(BASE_SKILLS);
    this.setBaseSkills(skills);
    this.setState({ skills });
  }

  toggleProficient = (key) => {
    const skills = cloneDeep(this.state.skills);
    // Toggle proficiency in skill
    skills[key].proficient = !skills[key].proficient;

    // Add or subtract proficiency appropriately after toggle
    skills[key].modifier +=
      (this.state.character.proficiency * (skills[key].proficient ? 1 : -1));

    this.setState({ skills });
  }

  render() {
    const ListItemRow = (key, skill) => {
      const negative = skill.modifier < 0;
      const textColor = negative ? COLOR.red500 : COLOR.green500;
      const modifier = Math.abs(skill.modifier);
      const proficiency = this.state.character.proficiency;
      return (
        <ListItem
          key={key}
          divider
          centerElement={
            <View style={styles.horizontalLayout}>
              <Text style={styles.smallHeading}>
                {skill.skillLabel} ({toTitleCase(skill.ability.substr(0, 3))})
              </Text>
              <Text
                style={[
                  styles.smallHeading,
                  styles.makeBold,
                  { color: skill.proficient ? COLOR.black : textColor },
                ]}
              >
                {
                  !skill.proficient && negative &&
                  <Text>&minus;{modifier}</Text>
                }
                {
                  !skill.proficient && !negative &&
                  <Text>+{modifier}</Text>
                }
                {
                  skill.proficient &&
                  <Text>
                    {modifier - proficiency} + {proficiency} =&nbsp;
                    <Text style={{ color: textColor }}>
                      {modifier >= 0 ? <Text>+</Text> : <Text>&minus;</Text>}
                      {modifier}
                    </Text>
                  </Text>
                }
              </Text>
            </View>
          }
          rightElement={
            <IconToggle
              name="check-circle"
              color={skill.proficient ? COLOR.green500 : COLOR.grey600}
              onPress={() => this.toggleProficient(key)}
            />
          }
        />
      );
    };
    const remainingSkills = Object.keys(this.state.skills).length -
      Object.keys(this.state.skills).filter(s => s.modifier === 0).length;
    const totalSkills = Object.keys(BASE_SKILLS).length;
    const hasChanged = Object.keys(this.state.skills)
      .filter(key => this.state.skills[key].proficient).length > 0;

    // TODO: info dialog about proficiency (based on level) above buttons
    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <View style={{ margin: 20 }}>
            <View style={styles.buttonLayout}>
              <TouchableHighlight
                style={[
                  styles.button,
                  styles.resetButton,
                  hasChanged ?
                    { opacity: 1 } :
                    { opacity: 0.5 },
                ]}
                onPress={() => this.resetSkills()}
                color={COLOR.red500}
                underlayColor={COLOR.red800}
                disabled={!hasChanged}
              >
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={[
                  styles.button,
                  styles.acceptScoresButton,
                  remainingSkills > 0 ?
                    { opacity: 0.5 } :
                    { opacity: 1 },
                ]}
                onPress={() => this.setSkills()}
                underlayColor="#1A237E"
                disabled={remainingSkills > 0}
              >
                <Text style={styles.buttonText}>
                  {
                    remainingSkills > 0 ?
                      `${remainingSkills} Skills Remaining` :
                      'Proceed'
                  }
                </Text>
              </TouchableHighlight>
            </View>
            <ListItem
              divider
              centerElement={
                <View style={styles.horizontalLayout}>
                  <Text style={styles.smallHeading}>Skill</Text>
                  <Text style={styles.smallHeading}>
                    Modifier / Is Proficient
                  </Text>
                </View>
              }
            />
            {
              Object.entries(this.state.skills)
                .map(skill => ListItemRow(skill[0], skill[1]))
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreList: {
    flex: 1,
    flexDirection: 'row',
  },
  bigHeading: {
    fontFamily: 'RobotoLight',
    color: '#000',
    fontSize: 24,
  },
  smallHeading: {
    fontFamily: 'RobotoLight',
    color: '#000',
    fontSize: 18,
  },
  makeBold: {
    fontFamily: 'RobotoBold',
  },
  buttonLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    alignSelf: 'center',
  },
  resetButton: {
    backgroundColor: COLOR.red500,
    borderColor: COLOR.red500,
    flex: 1,
    marginLeft: 10,
    marginRight: 5,
  },
  acceptScoresButton: {
    backgroundColor: '#3F51B5',
    borderColor: '#3F51B5',
    flex: 2,
    marginLeft: 5,
    marginRight: 10,
  },
});
