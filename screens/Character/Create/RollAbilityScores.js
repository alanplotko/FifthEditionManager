import React from 'react';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import { StyleSheet, ActivityIndicator, TouchableHighlight, Image, View, Text }
  from 'react-native';
import { Container, Content, List, ListItem } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card, COLOR, Toolbar } from 'react-native-material-ui';
import Modal from 'react-native-modal';
import store from 'react-native-simple-store';
import { ACTIVITY_KEY, CHARACTER_KEY } from 'DNDManager/config/StoreKeys';
import { BACKGROUNDS } from 'DNDManager/config/Info';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';
import FormStyle from 'DNDManager/stylesheets/FormStyle';
import { validateInteger } from 'DNDManager/util';

var Chance = require('chance');

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
    let scoreReports = [];
    let sortedScores = [];
    // Roll for 6 ability scores
    for (let i = 0; i < 6; i++) {
      let rolls = [];
      // Roll 4d6
      for (let j = 0; j < 4; j++) {
        rolls.push(chance.d6());
      }
      // Record all rolls
      let report = { rolls: rolls.slice(0) };
      // Drop and record lowest roll
      let lowestRollIndex = rolls.indexOf(Math.min.apply(null, rolls));
      report.lowestRollIndex = lowestRollIndex;
      rolls.splice(lowestRollIndex, 1);
      // Record sum and save report
      report.score = rolls.reduce((sum, x) => sum + x);
      scoreReports.push(report);
      sortedScores.push(report.score);
    }
    // Sort in reverse order
    sortedScores.sort((a, b) => (a > b) ? -1 : ((a < b) ? 1 : 0));
    // Return unsorted score reports and sorted scores
    done(scoreReports, sortedScores);
  }

  prepareRolls = () => {
    this.setState({
      isLoading: true,
      rollCount: this.state.rollCount + 1,
    }, () => {
      let callback = (scoreReports, sortedScores) => this.setState({
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
    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          {
            this.state.scoreReports &&
            <View style={{ marginHorizontal: 10, marginVertical: 20 }}>
              <Card
                style={{ container: { marginBottom: 10, padding: 10 } }}
              >
                <View style={styles.diceLayout}>
                  <Text style={styles.scoreLabel}>
                    Rolls:
                  </Text>
                  {this.state.sortedScores.map((val, key) => {
                    return (
                      <Text
                        key={key}
                        style={styles.scoreValue}
                      >
                        {val}
                      </Text>
                    );
                  })}
                </View>
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
                    styles.acceptScoresButton,
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
              {this.state.scoreReports.map((report, key) => {
                return (
                  <Card
                    key={key}
                    style={{ container: { marginBottom: 5, padding: 10 } }}
                  >
                    <View style={styles.diceLayout}>
                      <Text style={styles.scoreLabel}>
                        Roll {key + 1}:
                      </Text>
                      <Text style={styles.scoreValue}>
                        {report.score}
                      </Text>
                      {report.rolls.map((val, key) => {
                        return (
                          <Icon
                            key={key}
                            name={`dice-${val}`}
                            size={36}
                            color={
                              key === report.lowestRollIndex ?
                                COLOR.red500 :
                                "#333"
                            }
                          />
                        );
                      })}
                    </View>
                  </Card>
                );
              })}
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
  cardHeading: {
    fontFamily: 'RobotoLight',
    color: '#000',
    fontSize: 24,
    marginBottom: 10,
  },
  cardText: {
    fontFamily: 'Roboto',
    color: '#000',
    fontSize: 16,
    marginBottom: 10,
  },
  diceLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  dicePreText: {
    fontFamily: 'Roboto',
    color: '#333',
    fontSize: 18,
    marginRight: 5,
  },
  dicePostText: {
    fontFamily: 'RobotoBold',
    color: '#333',
    fontSize: 18,
    marginLeft: 5,
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
  scoreValue: {
    fontFamily: 'RobotoBold',
    color: '#000',
    fontSize: 24,
  },
  buttonLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    alignSelf: 'center',
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
  rerollButton: {
    backgroundColor: COLOR.red500,
    borderColor: COLOR.red500,
    flex: 2,
    marginLeft: 10,
    marginRight: 5,
  },
  acceptScoresButton: {
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
