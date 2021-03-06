import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import { Container, Content } from 'native-base';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Button, Card, COLOR, Toolbar, withTheme } from 'react-native-material-ui';
import Modal from 'react-native-modal';
import { CardStyle, ContainerStyle } from 'FifthEditionManager/stylesheets';
import { formatSingleDigit, reverseSort } from 'FifthEditionManager/util';

const Chance = require('chance');

const chance = new Chance();

class RollScores extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
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
      rolls.forEach(roll => report.rolls.push({ result: roll, isLowest: false }));
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
      character: state.params.character,
      scores: this.state.sortedScores,
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

  static navigationOptions = {
    header: ({ navigation }) => {
      const { routes, index } = navigation.state;
      const props = {
        leftElement: 'arrow-back',
        onLeftElementPress: () => navigation.goBack(routes[index].key),
        centerElement: 'Roll Ability Scores',
      };
      return <Toolbar {...props} />;
    },
  }

  render() {
    // Theme setup
    const { textColor } = this.props.theme.palette;
    const textStyle = { color: textColor };

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
          <View style={ContainerStyle.padded}>
            <Card
              style={{ container: CardStyle.containerNarrow }}
            >
              <Text style={[styles.scoreLabel, textStyle]}>
                Rolls:&nbsp;
                <Text style={CardStyle.makeBold}>
                  {this.state.sortedScores.join(', ')}
                </Text>
              </Text>
            </Card>
            <View style={styles.buttonLayout}>
              <Button
                accent
                raised
                disabled={this.state.isLoading}
                onPress={() => this.prepareRolls()}
                text="Reroll Scores"
                style={{
                  container: {
                    flex: 2,
                    marginRight: 5,
                    marginVertical: 20,
                  },
                }}
              />
              <Button
                primary
                raised
                disabled={this.state.isLoading}
                onPress={() => this.acceptRolls()}
                text="Proceed"
                style={{
                  container: {
                    flex: 1,
                    marginLeft: 5,
                    marginVertical: 20,
                  },
                }}
              />
            </View>
            {this.state.scoreReports.map(report => (
              <Card
                key={`${report.rollNumber}-${report.score}-${report.rolls.join('-')}`}
                style={{ container: CardStyle.containerNarrow }}
              >
                <View style={styles.diceLayout}>
                  <Text style={[styles.scoreLabel, textStyle]}>
                    Roll {report.rollNumber}:
                  </Text>
                  <Text style={[styles.scoreLabel, textStyle, CardStyle.makeBold]}>
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
        </Content>
        <Modal
          isVisible={this.state.isLoading}
          onBackButtonPress={() => {}}
          onBackdropPress={() => {}}
          backdropOpacity={0.7}
          style={{ margin: 0 }}
        >
          <View style={[styles.centered, styles.modalView]}>
            <ActivityIndicator color={COLOR.white} size="large" />
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
    color: COLOR.white,
    fontSize: 16,
    paddingVertical: 10,
  },
  scoreLabel: {
    fontFamily: 'RobotoLight',
    color: COLOR.black,
    fontSize: 24,
  },
  buttonLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalView: {
    backgroundColor: COLOR.transparent,
  },
});

export default withTheme(RollScores);
