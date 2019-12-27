import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import { Container, Content } from 'native-base';
import { Button, COLOR, Icon, IconToggle, ListItem, Toolbar, withTheme }
  from 'react-native-material-ui';
import Note from 'FifthEditionManager/components/Note';
import { BASE_SKILLS, BACKGROUNDS, CLASSES, ABILITIES } from 'FifthEditionManager/config/Info';
import { CardStyle, ContainerStyle } from 'FifthEditionManager/stylesheets';
import { toTitleCase, calculateProficiencyBonus } from 'FifthEditionManager/util';
import { cloneDeep, zipObject } from 'lodash';

const Chance = require('chance');

const chance = new Chance();

// Styles
const checkIconStyle = { opacity: 0.5, paddingHorizontal: 12 };

class Skills extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      skills: cloneDeep(BASE_SKILLS),
      isProficiencyNoteCollapsed: true,
      isBackgroundNoteCollapsed: true,
      isClassNoteCollapsed: true,
    };

    this.state.character = props.navigation.state.params.character;

    // Set character proficiency
    this.state.proficiency = calculateProficiencyBonus(this.state.character.profile.level);

    const baseClass = CLASSES
      .find(option => option.key === this.state.character.baseClass.lookupKey);
    const background = BACKGROUNDS
      .find(option => option.key === this.state.character.background.lookupKey);

    // Track given proficiencies
    this.state.proficiencies = {
      background: background.proficiencies.skillKeys,
      baseClass: baseClass.proficiencies.skills,
    };

    // Define proficiency options
    this.state.proficiencies.options =
      [...this.state.proficiencies.baseClass.optionKeys]
        .filter(skill => !this.state.proficiencies.background.includes(skill));
    // Track number of proficiency replacements the user will need to select
    this.state.proficiencies.extras =
      [...this.state.proficiencies.baseClass.optionKeys]
        .filter(skill => this.state.proficiencies.background.includes(skill))
        .length;
    // Keep original number of extras with original quantity in base class
    this.state.proficiencies.baseClass.extras = this.state.proficiencies.extras;
    // Track number of proficiencies that the user must select from the options
    this.state.proficiencies.quantity = this.state.proficiencies.baseClass.quantity;

    // Set up base skills with default proficiencies
    this.state.skills = this.setBaseSkills(this.state.skills);
  }

  componentDidMount() {
    this.props.navigation.setParams({ randomizeSkills: this.randomizeSkills });
  }

  setSkills = () => {
    const { navigate, state } = this.props.navigation;
    const newCharacter = cloneDeep(state.params.character);
    newCharacter.meta.lastUpdated = Date.now();
    newCharacter.skills = cloneDeep(this.state.skills);

    // Set character proficiency
    newCharacter.proficiency = this.state.proficiency;

    // Calculate saving throws
    const baseClass = CLASSES.find(option => option.key === newCharacter.baseClass.lookupKey);
    newCharacter.savingThrows = zipObject(
      ABILITIES,
      ABILITIES.map((ability) => {
        const { modifier } = newCharacter.stats[ability];
        const proficient = baseClass.proficiencies.savingThrows.includes(ability);
        const bonus = proficient ? newCharacter.proficiency : 0;
        return { modifier, proficient, total: modifier + bonus };
      }),
    );

    navigate('AssignLanguages', { character: newCharacter });
  }

  setBaseSkills = (copy) => {
    const skills = cloneDeep(copy);
    Object.entries(skills).forEach((skill) => {
      skills[skill[0]].modifier =
        this.state.character.stats[skill[1].ability].modifier;
      skills[skill[0]].proficient = this.state.proficiencies.background
        .includes(skill[0]);
      if (skills[skill[0]].proficient) {
        skills[skill[0]].modifier += this.state.proficiency;
      }
    });
    return skills;
  }

  static navigationOptions = {
    header: ({ navigation }) => {
      const { routes, index } = navigation.state;
      const props = {
        leftElement: 'arrow-back',
        onLeftElementPress: () => navigation.goBack(routes[index].key),
        centerElement: 'Set Skills',
        rightElement: 'autorenew',
        onRightElementPress: () => routes[index].params.randomizeSkills(),
      };
      return <Toolbar {...props} />;
    },
  }

  resetSkills = (callback = null) => {
    let skills = cloneDeep(BASE_SKILLS);
    const proficiencies = cloneDeep(this.state.proficiencies);
    proficiencies.quantity = this.state.proficiencies.baseClass.quantity;
    proficiencies.extras = this.state.proficiencies.baseClass.extras;
    skills = this.setBaseSkills(skills);
    this.setState({ skills, proficiencies }, callback);
  }

  toggleProficient = (key) => {
    const skills = cloneDeep(this.state.skills);
    const proficiencies = cloneDeep(this.state.proficiencies);

    // Toggle proficiency in skill
    skills[key].proficient = !skills[key].proficient;

    const change = (skills[key].proficient ? 1 : -1);

    // Add or subtract proficiency and quantity appropriately after toggle
    skills[key].modifier += (this.state.proficiency * change);
    proficiencies.quantity -= change;
    if (!proficiencies.options.includes(key)) {
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

  randomizeSkills = () => {
    const callback = () => {
      const skills = cloneDeep(this.state.skills);
      const proficiencies = cloneDeep(this.state.proficiencies);
      let standardOptions = proficiencies.options.slice(0);
      let extraOptions = Object.keys(BASE_SKILLS)
        .filter(skill => !proficiencies.background.includes(skill) &&
          !standardOptions.includes(skill));

      // Update selections
      const selectionCount = proficiencies.quantity;
      for (let i = 0; i < selectionCount; i += 1) {
        let key;
        if (proficiencies.extras > 0) {
          key = chance.pickone(standardOptions.concat(extraOptions));
        } else {
          key = chance.pickone(standardOptions);
        }
        // Toggle proficiency in skill
        skills[key].proficient = true;
        // Add proficiency and update quantity appropriately
        skills[key].modifier += this.state.proficiency;
        proficiencies.quantity -= 1;
        if (extraOptions.includes(key)) {
          proficiencies.extras -= 1;
          extraOptions = extraOptions.filter(skill => skill !== key);
        } else {
          standardOptions = standardOptions.filter(skill => skill !== key);
        }
      }

      this.setState({ skills, proficiencies });
    };
    this.resetSkills(callback);
  }

  render() {
    // Theme setup
    const { textColor } = this.props.theme.palette;
    const textStyle = { color: textColor };

    const ListItemRow = (key, skill) => {
      const negative = skill.modifier < 0;
      const checkedTextColor = negative ? COLOR.red500 : COLOR.green500;
      const modifier = Math.abs(skill.modifier);
      return (
        <ListItem
          key={key}
          divider
          centerElement={
            <View style={styles.horizontalLayout}>
              <Text style={[styles.smallHeading, textStyle]}>
                {skill.skillLabel} ({toTitleCase(skill.ability.substr(0, 3))})
              </Text>
              <Text
                style={[
                  styles.smallHeading,
                  CardStyle.makeBold,
                  { color: skill.proficient ? textColor : checkedTextColor },
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
                    {modifier - this.state.proficiency} + {this.state.proficiency} =&nbsp;
                    <Text style={{ color: checkedTextColor }}>
                      {modifier >= 0 ? <Text>+</Text> : <Text>&minus;</Text>}
                      {modifier}
                    </Text>
                  </Text>
                }
              </Text>
            </View>
          }
          rightElement={
            this.state.proficiencies.background.includes(key) ?
              <Icon
                name="check-circle"
                color={COLOR.green500}
                style={checkIconStyle}
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
                      !this.state.proficiencies.options.includes(key) &&
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
          <View style={ContainerStyle.padded}>
            <Note
              title="Calculating Proficiency Bonus"
              type="info"
              icon="info"
              collapsible
              isCollapsed={this.state.isProficiencyNoteCollapsed}
              toggleNoteHandler={this.toggleProficiencyNote}
            >
              <Text style={styles.textMargin}>
                The proficiency bonus is derived from your level. At
                <Text style={CardStyle.makeBold}>
                  &nbsp;level {this.state.character.profile.level}
                </Text>
                ,&nbsp;your proficiency bonus is
                <Text style={CardStyle.makeBold}>
                  &nbsp;+{this.state.proficiency}
                </Text>
                . A shortcut to determine the proficiency bonus is
                dividing your level by 4, rounding up, and adding 1.{'\n\n'}
                ceil({this.state.character.profile.level} / 4) + 1 =&nbsp;
                {Math.ceil(this.state.character.profile.level / 4)} + 1 =&nbsp;
                <Text style={CardStyle.makeBold}>
                  +{this.state.proficiency}
                </Text>
                .
              </Text>
            </Note>
            <Note
              title={`${this.state.character.background.name} Proficiencies`}
              type="info"
              icon="info"
              collapsible
              isCollapsed={this.state.isBackgroundNoteCollapsed}
              toggleNoteHandler={this.toggleBackgroundNote}
            >
              <Text style={styles.textMargin}>
                The
                <Text style={CardStyle.makeBold}>
                  &nbsp;{this.state.character.background.name}&nbsp;
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
              title={`${this.state.character.baseClass.name} Proficiencies`}
              type="info"
              icon="info"
              collapsible
              isCollapsed={this.state.isClassNoteCollapsed}
              toggleNoteHandler={this.toggleClassNote}
            >
              <Text style={styles.textMargin}>
                The
                <Text style={CardStyle.makeBold}>
                  &nbsp;{this.state.character.baseClass.name}&nbsp;
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
                      &nbsp;{this.state.character.background.name}&nbsp;
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
              <Button
                accent
                raised
                disabled={!hasChanged}
                onPress={() => this.resetSkills()}
                text="Reset"
                style={{
                  container: {
                    flex: 1,
                    marginRight: 5,
                    marginTop: 10,
                    marginBottom: 20,
                  },
                }}
              />
              <Button
                primary
                raised
                disabled={this.state.proficiencies.quantity > 0}
                onPress={() => this.setSkills()}
                text={
                  this.state.proficiencies.quantity > 0 ?
                    `${this.state.proficiencies.quantity} Skills Remaining` :
                    'Proceed'
                }
                style={{
                  container: {
                    flex: 2,
                    marginLeft: 5,
                    marginTop: 10,
                    marginBottom: 20,
                  },
                }}
              />
            </View>
            <ListItem
              divider
              centerElement={
                <View style={styles.horizontalLayout}>
                  <Text style={[styles.smallHeading, textStyle]}>Skill</Text>
                  <Text style={[styles.smallHeading, textStyle]}>
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
  textMargin: {
    marginBottom: 10,
  },
  horizontalLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallHeading: {
    fontFamily: 'RobotoLight',
    color: COLOR.black,
    fontSize: 18,
  },
  buttonLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default withTheme(Skills);
