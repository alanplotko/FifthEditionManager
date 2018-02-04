import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableHighlight, View, Text } from 'react-native';
import { Container, Content } from 'native-base';
import { COLOR, Icon, IconToggle, ListItem, Toolbar }
  from 'react-native-material-ui';
import Note from 'DNDManager/components/Note';
import { BASE_SKILLS, BACKGROUNDS, CLASSES } from 'DNDManager/config/Info';
import { CardStyle, ContainerStyle } from 'DNDManager/stylesheets';
import {
  toTitleCase,
  calculateProficiencyBonus,
  reformatCamelCaseKey,
} from 'DNDManager/util';
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
      isProficiencyNoteCollapsed: false,
      isBackgroundNoteCollapsed: false,
      isClassNoteCollapsed: false,
      ...props.navigation.state.params,
    };

    // Set character proficiency
    this.state.character.profile.proficiency =
      calculateProficiencyBonus(this.state.character.profile.level);

    // Track given proficiencies
    this.state.proficiencies = {
      background: BACKGROUNDS
        .find(option => option.name === this.state.character.profile.background)
        .proficiencies.skills,
      baseClass: CLASSES
        .find(option => option.name === this.state.character.profile.baseClass)
        .proficiencies.skills,
    };

    // Define proficiency options
    this.state.proficiencies.options =
      [...this.state.proficiencies.baseClass.options]
        .filter(skill => !this.state.proficiencies.background.includes(skill));
    // Track number of proficiency replacements the user will need to select
    this.state.proficiencies.extras =
      [...this.state.proficiencies.baseClass.options]
        .filter(skill => this.state.proficiencies.background.includes(skill))
        .length;
    // Keep original number of extras with original quantity in base class
    this.state.proficiencies.baseClass.extras = this.state.proficiencies.extras;
    // Track number of proficiencies that the user must select from the options
    this.state.proficiencies.quantity =
      this.state.proficiencies.baseClass.quantity;

    // Set up base skills with default proficiencies
    this.state.skills = this.setBaseSkills(this.state.skills);
  }

  setSkills = () => {
    const { navigate, state } = this.props.navigation;
    state.params.character.lastUpdated = Date.now();
    state.params.character.profile.skills = cloneDeep(this.state.skills);
    navigate('AssignLanguages', { ...state.params });
  }

  setBaseSkills = (copy) => {
    const skills = cloneDeep(copy);
    Object.entries(skills).forEach((skill) => {
      skills[skill[0]].modifier =
        this.state.character.profile.stats[skill[1].ability].modifier;
      skills[skill[0]].proficient = this.state.proficiencies.background
        .includes(skill[0]);
      if (skills[skill[0]].proficient) {
        skills[skill[0]].modifier += this.state.character.profile.proficiency;
      }
    });
    return skills;
  }

  resetSkills = () => {
    let skills = cloneDeep(BASE_SKILLS);
    const proficiencies = cloneDeep(this.state.proficiencies);
    proficiencies.quantity = this.state.proficiencies.baseClass.quantity;
    proficiencies.extras = this.state.proficiencies.baseClass.extras;
    skills = this.setBaseSkills(skills);
    this.setState({ skills, proficiencies });
  }

  toggleProficient = (key) => {
    const skills = cloneDeep(this.state.skills);
    const proficiencies = cloneDeep(this.state.proficiencies);

    // Toggle proficiency in skill
    skills[key].proficient = !skills[key].proficient;

    const change = (skills[key].proficient ? 1 : -1);

    // Add or subtract proficiency and quantity appropriately after toggle
    skills[key].modifier += (this.state.character.profile.proficiency * change);
    proficiencies.quantity -= change;
    const skillName = reformatCamelCaseKey(key);
    if (!proficiencies.options.includes(skillName)) {
      proficiencies.extras -= change;
    }

    this.setState({ skills, proficiencies });
  }

  toggleProficiencyNote = () => {
    this.setState({
      isProficiencyNoteCollapsed: !this.state.isProficiencyNoteCollapsed,
    });
  }

  toggleBackgroundNote = () => {
    this.setState({
      isBackgroundNoteCollapsed: !this.state.isBackgroundNoteCollapsed,
    });
  }

  toggleClassNote = () => {
    this.setState({
      isClassNoteCollapsed: !this.state.isClassNoteCollapsed,
    });
  }

  render() {
    const ListItemRow = (key, skill) => {
      const skillName = reformatCamelCaseKey(key);
      const negative = skill.modifier < 0;
      const textColor = negative ? COLOR.red500 : COLOR.green500;
      const modifier = Math.abs(skill.modifier);
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
                  CardStyle.makeBold,
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
                    {modifier - this.state.character.profile.proficiency}
                    &nbsp;+&nbsp;
                    {this.state.character.profile.proficiency} =&nbsp;
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
            this.state.proficiencies.background.includes(skillName) ?
              <Icon
                name="check-circle"
                color={COLOR.green500}
                style={{ opacity: 0.5, paddingHorizontal: 12 }}
              /> :
              <IconToggle
                name="check-circle"
                color={skill.proficient ? COLOR.green500 : COLOR.grey600}
                percent={75}
                onPress={() => this.toggleProficient(key)}
                disabled={
                  !skill.proficient &&
                  (
                    this.state.proficiencies.quantity === 0 ||
                    (
                      !this.state.proficiencies.options.includes(skillName) &&
                      this.state.proficiencies.extras === 0
                    )
                  )
                }
              />
          }
        />
      );
    };
    const hasChanged = Object.keys(this.state.skills)
      .filter(key => this.state.skills[key].proficient)
      .length > this.state.proficiencies.background.length;

    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <View style={{ margin: 20 }}>
            <Note
              title="Calculating Proficiency Bonus"
              type="info"
              icon="info"
              collapsible
              isCollapsed={this.state.isProficiencyNoteCollapsed}
              toggleNoteHandler={this.toggleProficiencyNote}
            >
              <Text style={{ marginBottom: 10 }}>
                The proficiency bonus is derived from your level. At
                <Text style={CardStyle.makeBold}>
                  &nbsp;level {this.state.character.profile.level}
                </Text>
                ,&nbsp;your proficiency bonus is
                <Text style={CardStyle.makeBold}>
                  &nbsp;+{this.state.character.profile.proficiency}
                </Text>
                . A shortcut to determine the proficiency bonus is
                dividing your level by 4, rounding up, and adding 1.{'\n\n'}
                ceil({this.state.character.profile.level} / 4) + 1 =&nbsp;
                {Math.ceil(this.state.character.profile.level / 4)} + 1 =&nbsp;
                <Text style={CardStyle.makeBold}>
                  +{this.state.character.profile.proficiency}
                </Text>
                .
              </Text>
            </Note>
            <Note
              title={`${this.state.character.profile.background} Proficiencies`}
              type="info"
              icon="info"
              collapsible
              isCollapsed={this.state.isBackgroundNoteCollapsed}
              toggleNoteHandler={this.toggleBackgroundNote}
            >
              <Text style={{ marginBottom: 10 }}>
                The
                <Text style={CardStyle.makeBold}>
                  &nbsp;{this.state.character.profile.background}&nbsp;
                </Text>
                background grants the following proficiencies and will be
                set automatically:{'\n\n'}
              </Text>
              {this.state.proficiencies.background.map(key => (
                <Text key={`${key}-background-list`}>
                  &emsp;&bull;&nbsp;{toTitleCase(key)}{'\n'}
                </Text>
              ))}
            </Note>
            <Note
              title={`${this.state.character.profile.baseClass} Proficiencies`}
              type="info"
              icon="info"
              collapsible
              isCollapsed={this.state.isClassNoteCollapsed}
              toggleNoteHandler={this.toggleClassNote}
            >
              <Text style={{ marginBottom: 10 }}>
                The
                <Text style={CardStyle.makeBold}>
                  &nbsp;{this.state.character.profile.baseClass}&nbsp;
                </Text>
                class grants
                <Text style={CardStyle.makeBold}>
                  &nbsp;{this.state.proficiencies.baseClass.quantity}&nbsp;
                </Text>
                proficiencies from the list below
                {
                  this.state.proficiencies.baseClass.extras === 0 &&
                  <Text>
                  :
                  </Text>
                }
                {
                  this.state.proficiencies.baseClass.extras > 0 &&
                  <Text>
                    ,
                    <Text style={CardStyle.makeBold}>
                      &nbsp;{this.state.proficiencies.baseClass.extras}&nbsp;
                    </Text>
                    of which&nbsp;
                    {
                      this.state.proficiencies.baseClass.extras > 1 ?
                        'are' :
                        'is'
                    }
                    &nbsp;accounted for with your
                    <Text style={CardStyle.makeBold}>
                      &nbsp;{this.state.character.profile.background}&nbsp;
                    </Text>
                    background. As such, of the
                    <Text style={CardStyle.makeBold}>
                      &nbsp;{this.state.proficiencies.baseClass.quantity}&nbsp;
                    </Text>
                    {
                      this.state.proficiencies.baseClass.quantity > 1 ?
                        'proficiencies' :
                        'proficiency'
                    }
                    &nbsp;to select,
                    <Text style={CardStyle.makeBold}>
                      &nbsp;{this.state.proficiencies.baseClass.extras}&nbsp;
                    </Text>
                    {
                      this.state.proficiencies.baseClass.extras > 1 ?
                        'proficiencies' :
                        'proficiency'
                    }
                    &nbsp;may come from outside the below list:
                  </Text>
                }
                {'\n\n'}
              </Text>
              {this.state.proficiencies.options.map(key => (
                <Text key={`${key}-option-list`}>
                  &emsp;&bull;&nbsp;{toTitleCase(key)}{'\n'}
                </Text>
              ))}
            </Note>
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
                  styles.acceptButton,
                  this.state.proficiencies.quantity > 0 ?
                    { opacity: 0.5 } :
                    { opacity: 1 },
                ]}
                onPress={() => this.setSkills()}
                underlayColor="#1A237E"
                disabled={this.state.proficiencies.quantity > 0}
              >
                <Text style={styles.buttonText}>
                  {
                    this.state.proficiencies.quantity > 0 ?
                      `${this.state.proficiencies.quantity} Skills Remaining` :
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
  acceptButton: {
    backgroundColor: '#3F51B5',
    borderColor: '#3F51B5',
    flex: 2,
    marginLeft: 5,
    marginRight: 10,
  },
});
