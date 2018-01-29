import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableHighlight, View, Text } from 'react-native';
import { Container, Content } from 'native-base';
import { Button, Card, COLOR, Toolbar } from 'react-native-material-ui';
import Modal from 'react-native-modal';
import Note from 'DNDManager/components/Note';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';
import FormStyle from 'DNDManager/stylesheets/FormStyle';
import { toTitleCase, calculateModifier } from 'DNDManager/util';

const abilities = [
  'Strength',
  'Dexterity',
  'Constitution',
  'Intelligence',
  'Wisdom',
  'Charisma',
];

export default class AssignAbilityScores extends React.Component {
  static navigationOptions = {
    header: ({ navigation }) => {
      const props = {
        leftElement: 'arrow-back',
        onLeftElementPress: () => navigation.goBack(),
        centerElement: 'Assign Ability Scores',
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
      scores: [],
      scoreBank: [],
      isModalVisible: false,
      isErrorCollapsed: false,
      isInfoCollapsed: false,
      selectedAbility: null,
      extraPoints: 0,
      hasExtraPoint: [],
      baseStats: {
        strength: null,
        dexterity: null,
        constitution: null,
        intelligence: null,
        wisdom: null,
        charisma: null,
      },
      additionalStats: {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      },
      ...props.navigation.state.params,
    };

    if (this.state.character.profile.raceModifiers.extra) {
      this.state.extraPoints = this.state.character.profile.raceModifiers.extra;
    }
    Object.keys(this.state.character.profile.raceModifiers).forEach((key) => {
      if (key !== 'extra') {
        this.state.additionalStats[key] =
          this.state.character.profile.raceModifiers[key];
      }
    });

    this.state.scores.forEach((score) => {
      const index = this.state.scoreBank.findIndex(s => s.score === score);
      if (index !== -1) {
        this.state.scoreBank[index].quantity += 1;
      } else {
        this.state.scoreBank.push({ score, quantity: 1 });
      }
    });
  }

  onPress = () => {
    const { state, navigate } = this.props.navigation;
    const newCharacter = Object.assign({}, state.params.character);
    newCharacter.lastUpdated = Date.now();
    const stats = {};
    abilities.forEach((ability) => {
      const abilityName = ability.toLowerCase();
      const score = this.state.baseStats[abilityName] +
        this.state.additionalStats[abilityName];
      const modifier = calculateModifier(score);
      const total = score + modifier;
      stats[abilityName] = { score, modifier, total };
    });
    newCharacter.profile = Object.assign({}, newCharacter.profile, { stats });
    navigate('SetSkills', { character: newCharacter });

    // const newActivity = {
    //   key: uuidv4(),
    //   timestamp: newCharacter.lastUpdated,
    //   action: 'Created New Character',
    //   // Format character's full name for extra text
    //   extra: `${newCharacter.profile.firstName.charAt(0).toUpperCase()}
    //     ${newCharacter.profile.firstName.slice(1)}
    //     ${newCharacter.profile.lastName.charAt(0).toUpperCase()}
    //     ${newCharacter.profile.lastName.slice(1)}`,
    //   thumbnail: newCharacter.profile.images.race,
    //   icon: {
    //     name: 'add-circle',
    //     color: '#fff',
    //   },
    // };
    // store
    //   .push(CHARACTER_KEY, newCharacter)
    //   .catch((error) => {
    //     // Show error message on screen and allow resubmit
    //     this.setState({ error: 'Please try again in a few minutes.' });
    //     return error;
    //   })
    //   .then((error) => {
    //     if (error) return;
    //     store
    //       .push(ACTIVITY_KEY, newActivity)
    //       .then(() => {
    //         const resetAction = NavigationActions.reset({
    //           index: 0,
    //           actions: [NavigationActions.navigate({
    //             routeName: 'Home',
    //           })],
    //         });
    //         dispatch(resetAction);
    //       });
    //   });
  }

  openModal = (ability) => {
    this.setState({ isModalVisible: true, selectedAbility: ability });
  }

  cancelModal = () => {
    this.setState({ isModalVisible: false, selectedAbility: null });
  }

  selectScore = (scoreCard) => {
    const ability = this.state.selectedAbility;
    const scoreBank = this.state.scoreBank.slice(0);
    const baseStats = Object.assign({}, this.state.baseStats);

    // Add 1 to previously selected score's quantity
    const currentScore = baseStats[ability];
    if (currentScore) {
      const currentIndex = scoreBank.findIndex(s => s.score === currentScore);
      if (currentIndex > -1) {
        scoreBank[currentIndex].quantity += 1;
      }
    }

    // Remove 1 from new selected score's quantity
    const newIndex = scoreBank.findIndex(s => s.score === scoreCard.score);
    scoreBank[newIndex].quantity -= 1;

    // Set new score
    baseStats[ability] = scoreBank[newIndex].score;

    this.setState({ scoreBank, baseStats });
  }

  resetStat = (ability) => {
    const scoreBank = this.state.scoreBank.slice(0);
    const baseStats = Object.assign({}, this.state.baseStats);

    // Add 1 to previously selected score's quantity
    const currentScore = baseStats[ability];
    if (currentScore) {
      const currentIndex = scoreBank.findIndex(s => s.score === currentScore);
      if (currentIndex > -1) {
        scoreBank[currentIndex].quantity += 1;
      }
    }

    // Remove extra modifier if present
    if (this.state.hasExtraPoint.includes(ability)) {
      this.removeExtraModifier(ability);
    }

    baseStats[ability] = null;
    this.setState({ scoreBank, baseStats });
  }

  addExtraModifier = (ability) => {
    // Record ability as having an extra modifier
    const hasExtraPoint = this.state.hasExtraPoint.slice(0);
    hasExtraPoint.push(ability);

    // Add extra modifier to stat
    const additionalStats = Object.assign({}, this.state.additionalStats);
    additionalStats[ability] += 1;


    // Remove modifier from extra point pool
    let { extraPoints } = this.state;
    extraPoints -= 1;

    this.setState({ extraPoints, hasExtraPoint, additionalStats });
  }

  removeExtraModifier = (ability) => {
    // Remove ability from record of having an extra modifier
    let hasExtraPoint = this.state.hasExtraPoint.slice(0);
    hasExtraPoint = hasExtraPoint.filter(a => a !== ability);

    // Remove extra modifier from stat
    const additionalStats = Object.assign({}, this.state.additionalStats);
    additionalStats[ability] -= 1;

    // Return modifier to extra point pool
    let { extraPoints } = this.state;
    extraPoints += 1;

    this.setState({ extraPoints, hasExtraPoint, additionalStats });
  }

  toggleInfoNote = () => {
    this.setState({ isInfoCollapsed: !this.state.isInfoCollapsed });
  }

  toggleErrorNote = () => {
    this.setState({ isErrorCollapsed: !this.state.isErrorCollapsed });
  }

  render() {
    const isSelectable = scoreCard => (
      // Score is selected
      (this.state.baseStats[this.state.selectedAbility] === scoreCard.score) ||
      // Score is not selected and has at least 1 remaining
      (this.state.baseStats[this.state.selectedAbility] !== scoreCard.score &&
        scoreCard.quantity > 0)
    );
    const isSelected = scoreCard => (
      this.state.baseStats[this.state.selectedAbility] === scoreCard.score
    );
    const buildAbilityCard = (ability) => {
      const abilityScore = this.state.baseStats[ability];
      const additionalPoints = this.state.additionalStats[ability];
      const totalScore = abilityScore + additionalPoints;
      const modifier = calculateModifier(totalScore);

      return (
        <View style={[styles.centered, { width: 100, height: 140 }]}>
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
            onPress={() => this.openModal(ability)}
          >
            {
              this.state.baseStats[ability] &&
              <Text style={styles.score}>
                {totalScore}
              </Text>
            }
            {
              this.state.baseStats[ability] &&
              <Text
                style={styles.modifier}
              >
                {
                  modifier > 0 &&
                  <Text style={{ color: COLOR.green500 }}>
                    +{modifier}
                  </Text>
                }
                {
                  modifier === 0 &&
                  <Text>
                    +{modifier}
                  </Text>
                }
                {
                  modifier < 0 &&
                  <Text style={{ color: COLOR.red500 }}>
                    &minus;{modifier * -1}
                  </Text>
                }
              </Text>
            }
            {
              !this.state.baseStats[ability] &&
              <Text style={styles.cardText}>&mdash;</Text>
            }
          </Card>
          <Button
            onPress={() => this.resetStat(ability)}
            accent
            raised
            text="Reset"
            icon="refresh"
            disabled={!this.state.baseStats[ability]}
            style={{
              container: { width: 100, height: 40 },
            }}
          />
        </View>
      );
    };
    const buildScoreCard = (scoreCard) => {
      const standardColor = isSelectable(scoreCard) ?
        COLOR.white :
        COLOR.redA100;
      const backgroundColor = isSelected(scoreCard) ?
        COLOR.greenA100 :
        standardColor;
      return (
        <View
          key={`${scoreCard.score}-${scoreCard.quantity}`}
          style={{ width: 80, height: 80 }}
        >
          <Card
            style={{
              container: {
                width: 70,
                height: 70,
                padding: 10,
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                flexWrap: 'wrap',
                marginHorizontal: 10,
                backgroundColor,
                opacity: isSelectable(scoreCard) ? 1 : 0.3,
              },
            }}
            onPress={
              this.state.baseStats[this.state.selectedAbility] !==
                scoreCard.score && scoreCard.quantity > 0 ?
                  () => this.selectScore(scoreCard) :
                  null
            }
          >
            {
              scoreCard.score &&
              <Text style={styles.cardText}>{scoreCard.score}</Text>
            }
            {
              !scoreCard.score &&
              <Text style={styles.cardText}>&mdash;</Text>
            }
            {
              scoreCard.quantity !== null &&
              <Text style={styles.quantityText}>
                &times;{scoreCard.quantity}
              </Text>
            }
          </Card>
        </View>
      );
    };
    const buildModal = () => {
      const ability = this.state.selectedAbility;
      const hasExtraPoint = this.state.hasExtraPoint.includes(ability);
      const characterHasModifier = this.state.character.profile
        .raceModifiers[ability];
      const abilityScore = this.state.baseStats[ability];
      const additionalPoints = this.state.additionalStats[ability];
      const totalScore = abilityScore + additionalPoints;

      return (
        <View style={styles.modalLayout}>
          {
            ability &&
            <Text style={styles.cardTitle}>
              Editing {toTitleCase(ability)}
            </Text>
          }
          <View style={styles.modalHorizontalLayout}>
            {
              this.state.scoreBank
                .slice(0, Math.ceil(this.state.scoreBank.length / 2))
                .map(scoreCard => buildScoreCard(scoreCard))
            }
          </View>
          <View style={styles.modalHorizontalLayout}>
            {
              this.state.scoreBank
                .slice(
                  Math.ceil(this.state.scoreBank.length / 2),
                  this.state.scoreBank.length,
                )
                .map(scoreCard => buildScoreCard(scoreCard))
            }
          </View>
          {
            this.state.character.profile.raceModifiers.extra &&
            <Button
              onPress={
                !hasExtraPoint ?
                  () => this.addExtraModifier(ability) :
                  () => this.removeExtraModifier(ability)
              }
              raised
              primary={!hasExtraPoint}
              accent={hasExtraPoint}
              text={hasExtraPoint ? 'Remove Extra Point' : 'Use Extra Point'}
              disabled={
                !abilityScore ||
                (!hasExtraPoint && this.state.extraPoints === 0)
              }
              style={{ container: { marginBottom: 10 } }}
            />
          }
          {
            ability &&
            <View>
              <Card style={{ container: { padding: 10 } }}>
                {
                  abilityScore &&
                  <Text style={styles.calculationTitle}>
                    Total:&nbsp;
                    <Text style={styles.calculationText}>
                      {abilityScore || '?'}
                      <Text style={{ color: COLOR.green500 }}>
                        {characterHasModifier && ` + ${characterHasModifier}`}
                        {hasExtraPoint && ' + 1'}
                      </Text>
                      {
                        (characterHasModifier || hasExtraPoint) &&
                        <Text>
                          &nbsp;=&nbsp;{totalScore}
                        </Text>
                      }
                    </Text>
                  </Text>
                }
                {
                  !abilityScore &&
                  <Text style={styles.calculationTitle}>
                    No Score Selected
                  </Text>
                }
              </Card>
            </View>
          }
        </View>
      );
    };
    const modifierList = Object
      .keys(this.state.character.profile.raceModifiers)
      .filter(name => name !== 'extra');

    const pointPlurality = this.state.extraPoints > 1 ? 'points' : 'point';

    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <View style={{ margin: 20 }}>
            <Text style={FormStyle.heading}>Character Ability Scores</Text>
            {
              modifierList.length > 0 &&
              <Note
                title={`${this.state.character.profile.race} Stats`}
                type="info"
                icon="info"
                collapsible
                isCollapsed={this.state.isInfoCollapsed}
                toggleNoteHandler={this.toggleInfoNote}
              >
                <Text style={{ marginBottom: 10 }}>
                  The
                  <Text style={styles.makeBold}>
                    &nbsp;{this.state.character.profile.race}&nbsp;
                  </Text>
                  race grants the following points and will be allocated
                  automatically:{'\n\n'}
                </Text>
                {modifierList.map(key => (
                  <Text key={key}>
                    &emsp;&bull;&nbsp;{toTitleCase(key)}&nbsp;(
                    {
                      this.state.character.profile.raceModifiers[key] > 0 ?
                      '+' :
                      ''
                    }
                    {this.state.character.profile.raceModifiers[key]})
                    {'\n'}
                  </Text>
                ))}
              </Note>
            }
            {
              this.state.extraPoints > 0 &&
              <Note
                title={`${this.state.extraPoints} ${pointPlurality} remaining!`}
                type="error"
                icon="error"
                collapsible
                isCollapsed={this.state.isErrorCollapsed}
                toggleNoteHandler={this.toggleErrorNote}
              >
                <Text>
                  The
                  <Text style={styles.makeBold}>
                    &nbsp;{this.state.character.profile.race}&nbsp;
                  </Text>
                  race grants an additional
                  <Text style={styles.makeBold}>
                    &nbsp;
                    {this.state.character.profile.raceModifiers.extra}
                    &nbsp;
                  </Text>
                  points to your abilities. You can allocate only 1 additional
                  point for a single ability until all
                  <Text style={styles.makeBold}>
                    &nbsp;
                    {this.state.character.profile.raceModifiers.extra}
                    &nbsp;
                  </Text>
                  points are spent.
                </Text>
              </Note>
            }
            <View style={styles.horizontalLayout}>
              {abilities.slice(0, 3).map(ability => (
                <View key={ability} style={styles.centered}>
                  <Text style={styles.abilityText}>{ability}</Text>
                  {buildAbilityCard(ability.toLowerCase())}
                </View>
              ))}
            </View>
            <View style={styles.horizontalLayout}>
              {abilities.slice(3, 6).map(ability => (
                <View key={ability} style={styles.centered}>
                  <Text style={styles.abilityText}>{ability}</Text>
                  {buildAbilityCard(ability.toLowerCase())}
                </View>
              ))}
            </View>
            <TouchableHighlight
              style={[
                FormStyle.submitBtn,
                this.state.isModalVisible ||
                this.state.extraPoints > 0 ||
                Object.values(this.state.baseStats).includes(null) ?
                  { opacity: 0.5 } :
                  { opacity: 1 },
                { marginTop: 20, marginBottom: 10 },
              ]}
              onPress={this.onPress}
              underlayColor="#1A237E"
              disabled={
                this.state.isModalVisible ||
                this.state.extraPoints > 0 ||
                Object.values(this.state.baseStats).includes(null)
              }
            >
              <Text style={FormStyle.submitBtnText}>
                Set Ability Scores
              </Text>
            </TouchableHighlight>
          </View>
          <Modal
            isVisible={this.state.isModalVisible}
            onBackButtonPress={() => this.cancelModal()}
            onBackdropPress={() => this.cancelModal()}
            backdropOpacity={0.7}
            style={{ margin: 0 }}
          >
            {buildModal()}
          </Modal>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  abilityText: {
    fontFamily: 'RobotoLight',
    color: '#000',
    fontSize: 18,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    fontFamily: 'RobotoLight',
    color: '#000',
    fontSize: 16,
  },
  horizontalLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalLayout: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.grey200,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
  },
  modalHorizontalLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontFamily: 'RobotoLight',
    color: '#000',
    fontSize: 24,
    marginBottom: 10,
  },
  makeBold: {
    fontFamily: 'RobotoBold',
  },
  calculationTitle: {
    fontFamily: 'RobotoLight',
    color: '#000',
    fontSize: 24,
  },
  calculationText: {
    fontFamily: 'RobotoBold',
    color: '#000',
    fontSize: 24,
  },
  cardText: {
    fontFamily: 'RobotoBold',
    color: '#000',
    fontSize: 28,
  },
  score: {
    fontFamily: 'RobotoBold',
    color: '#000',
    fontSize: 28,
  },
  modifier: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    fontFamily: 'RobotoBold',
    color: '#000',
    fontSize: 18,
  },
});
