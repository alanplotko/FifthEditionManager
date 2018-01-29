import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ActivityIndicator, TouchableHighlight, View, Text }
  from 'react-native';
import { Container, Content } from 'native-base';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Card, COLOR, Toolbar } from 'react-native-material-ui';
import Modal from 'react-native-modal';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';
import { formatSingleDigit, reverseSort } from 'DNDManager/util';

const Chance = require('chance');

const chance = new Chance();

export default class RollAbilityScores extends React.Component {
  static navigationOptions = {
    header: ({ navigation }) => {
      const props = {
        leftElement: 'arrow-back',
        onLeftElementPress: () => navigation.goBack(),
        centerElement: 'Roll Ability Scores',
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
      isLoading: false,
      rollCount: 1,
      scoreReports: null,
      sortedScores: null,
    };
    if (this.state.scoreReports === null) {
      this.rollAbilityScores((scoreReports, sortedScores) => {
        this.state.scoreReports = scoreReports;
        this.state.sortedScores = sortedScores;
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.showLoadingOverlay);
  }

  rollAbilityScores = (done) => {
    const scoreReports = [];
    const sortedScores = [];
    // Roll for 6 ability scores
    for (let i = 0; i < 6; i += 1) {
      const rolls = [];
      // Roll 4d6
      for (let j = 0; j < 4; j += 1) {
        rolls.push(chance.d6());
      }
      // Set up roll report
      const report = { rolls: [] };
      // Record roll number (roll #x of 6 ability scores) and final dice values
      report.rollNumber = i + 1;
      rolls.forEach(roll =>
        report.rolls.push({ result: roll, isLowest: false }));
      // Drop and record lowest roll
      const lowestRollIndex = rolls.indexOf(Math.min.apply(null, rolls));
      report.rolls[lowestRollIndex].isLowest = true;
      rolls.splice(lowestRollIndex, 1);
      // Record final score in report and separate score list
      report.score = rolls.reduce((sum, x) => sum + x);
      scoreReports.push(report);
      sortedScores.push(report.score);
    }
    // Return score reports (rolled order) and sorted scores (descending order)
    sortedScores.sort(reverseSort);
    done(scoreReports, sortedScores);
  }

  acceptRolls = () => {
    const { navigate, state } = this.props.navigation;
    navigate('AssignAbilityScores', {
      scores: this.state.sortedScores,
      ...state.params,
    });
  }

  prepareRolls = () => {
    this.setState({
      isLoading: true,
      rollCount: this.state.rollCount + 1,
    }, () => {
      const callback = (scoreReports, sortedScores) => this.setState({
        isLoading: false,
        scoreReports,
        sortedScores,
      });
      this.showLoadingOverlay = setTimeout(() => {
        this.rollAbilityScores(callback);
      }, 1000);
    });
  }

  render() {
    const dice = roll => (
      <Icon
        name={`dice-${roll.result}`}
        size={36}
        color={roll.isLowest ? COLOR.red500 : '#333'}
      />
    );
    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          {
            this.state.scoreReports &&
            <View style={{ marginHorizontal: 10, marginVertical: 20 }}>
              <Card
                style={{ container: { marginBottom: 10, padding: 10 } }}
              >
                <Text style={styles.scoreLabel}>
                  Rolls:&nbsp;
                  <Text style={styles.makeBold}>
                    {this.state.sortedScores.join(', ')}
                  </Text>
                </Text>
              </Card>
              <View style={styles.buttonLayout}>
                <TouchableHighlight
                  style={[
                    styles.button,
                    styles.rerollButton,
                    this.state.isLoading ?
                      { opacity: 0.5 } :
                      { opacity: 1 },
                  ]}
                  onPress={() => this.prepareRolls()}
                  color={COLOR.red500}
                  underlayColor={COLOR.red800}
                  disabled={this.state.isLoading}
                >
                  <Text style={styles.buttonText}>Reroll Scores</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={[
                    styles.button,
                    styles.acceptButton,
                    this.state.isLoading ?
                      { opacity: 0.5 } :
                      { opacity: 1 },
                  ]}
                  onPress={() => this.acceptRolls()}
                  underlayColor="#1A237E"
                  disabled={this.state.isLoading}
                >
                  <Text style={styles.buttonText}>Proceed</Text>
                </TouchableHighlight>
              </View>
              {this.state.scoreReports.map(report => (
                <Card
                  key={`${report.rollNumber}-${report.score}-${report.rolls.join('-')}`}
                  style={{ container: { marginBottom: 5, padding: 10 } }}
                >
                  <View style={styles.diceLayout}>
                    <Text style={styles.scoreLabel}>
                      Roll {report.rollNumber}:
                    </Text>
                    <Text style={[styles.scoreLabel, styles.makeBold]}>
                      {formatSingleDigit(report.score)}
                    </Text>
                    {dice(report.rolls[0])}
                    {dice(report.rolls[1])}
                    {dice(report.rolls[2])}
                    {dice(report.rolls[3])}
                  </View>
                </Card>
              ))}
            </View>
          }
        </Content>
        <Modal
          isVisible={this.state.isLoading}
          onBackButtonPress={() => {}}
          onBackdropPress={() => {}}
          backdropOpacity={0.7}
          style={{ margin: 0 }}
        >
          <View style={[styles.centered, styles.modalView]}>
            <ActivityIndicator color="#fff" size="large" />
            <Text style={styles.loadingText}>
              Rerolling...
            </Text>
          </View>
        </Modal>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  diceLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'RobotoBold',
    color: '#fff',
    fontSize: 16,
    paddingVertical: 10,
  },
  scoreLabel: {
    fontFamily: 'RobotoLight',
    color: '#000',
    fontSize: 24,
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
  rerollButton: {
    backgroundColor: COLOR.red500,
    borderColor: COLOR.red500,
    flex: 2,
    marginLeft: 10,
    marginRight: 5,
  },
  acceptButton: {
    backgroundColor: '#3F51B5',
    borderColor: '#3F51B5',
    flex: 1,
    marginLeft: 5,
    marginRight: 10,
  },
  modalView: {
    backgroundColor: 'transparent',
  },
});
