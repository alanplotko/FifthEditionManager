import React from 'react';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import { StyleSheet, ActivityIndicator, TouchableHighlight, Image, View, Text }
  from 'react-native';
import { Container, Content } from 'native-base';
import { Badge, Card, COLOR, IconToggle, Toolbar }
  from 'react-native-material-ui';
import Modal from 'react-native-modal';
import store from 'react-native-simple-store';
import { ACTIVITY_KEY, CHARACTER_KEY } from 'DNDManager/config/StoreKeys';
import { BACKGROUNDS } from 'DNDManager/config/Info';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';
import FormStyle from 'DNDManager/stylesheets/FormStyle';
import { validateInteger } from 'DNDManager/util';

var Chance = require('chance');

const chance = new Chance();

export default class PointBuyScores extends React.Component {
  static navigationOptions = {
    header: ({ navigation }) => {
      const props = {
        leftElement: 'arrow-back',
        onLeftElementPress: () => navigation.goBack(),
        centerElement: 'Point Buy Ability Scores',
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
      points: 27,
      scores: [],
      scoreSet: {
        '8': 0,
        '9': 0,
        '10': 0,
        '11': 0,
        '12': 0,
        '13': 0,
        '14': 0,
        '15': 0,
      }
    };
  }

  render() {
    const PointCard = (score, cost) => (
      <Card style={{ container: { flex: 1, height: 100 } }}>
        <View style={styles.horizontalLayout}>
          <IconToggle
            name="remove-circle"
            size={24}
            percent={75}
            onPress={() => {
              let scoreSet = Object.assign({}, this.state.scoreSet);
              let scores = [...this.state.scores];
              scoreSet[score.toString()]--;
              let points = this.state.points + cost;
              if (scores.length === 0 || scoreSet[score.toString()] < 0) {
                return;
              }
              scores.splice(scores.indexOf(score), 1);
              this.setState({ points, scores, scoreSet });
            }}
          />
          <Text style={[styles.generalLabel, styles.scoreLabel]}>{score}</Text>
          <IconToggle
            name="add-circle"
            size={24}
            percent={75}
            onPress={() => {
              let scoreSet = Object.assign({}, this.state.scoreSet);
              let scores = [...this.state.scores];
              scoreSet[score.toString()]++;
              let points = this.state.points - cost;
              if (scores.length === 6 || points < 0) {
                return;
              }
              scores.push(score);
              // Sort in reverse order
              scores.sort((a, b) => (a > b) ? -1 : ((a < b) ? 1 : 0));
              this.setState({ points, scores, scoreSet });
            }}
          />
        </View>
        <View style={{ alignItems: 'center', paddingBottom: 10 }}>
          <Text style={styles.infoText}>
            <Text style={styles.number}>
              {cost}
            </Text>&nbsp;points
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.number}>
              {this.state.scoreSet[score.toString()]}
            </Text>&nbsp;used
          </Text>
        </View>
      </Card>
    );
    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <View style={{ margin: 20 }}>
            <Card
              style={{ container: { marginBottom: 10, padding: 10 } }}
            >
              <Text style={[styles.generalLabel, styles.scoreLabel]}>
                <Text style={[styles.generalLabel, styles.number]}>
                  {this.state.points}
                </Text>
                &nbsp;Points&nbsp;/&nbsp;
                <Text
                  style={{
                    color: 6 - this.state.scores.length > 0 ?
                      COLOR.red500 :
                      COLOR.green500,
                  }}
                >
                  <Text
                    style={[
                      styles.generalLabel,
                      styles.number,
                      {
                        color: 6 - this.state.scores.length > 0 ?
                          COLOR.red500 :
                          COLOR.green500,
                      },
                    ]}>
                    {6 - this.state.scores.length}
                  </Text>&nbsp;Scores Left
                </Text>
              </Text>
              <View style={styles.scoreList}>
                <Text
                  key="scoreLabel"
                  style={[styles.generalLabel, styles.scoreLabel]}
                >
                  Scores:&nbsp;
                  {
                    this.state.scores.length === 0 &&
                    'None'
                  }
                </Text>
                {this.state.scores.map((val, key) => {
                  return (
                    <Text
                      key={key}
                      style={[styles.generalLabel, styles.number]}
                    >
                      {
                        key < this.state.scores.length - 1 ?
                        `${val}, ` :
                        `${val}`
                      }
                    </Text>
                  );
                })}
              </View>
            </Card>
            <TouchableHighlight
              style={[
                styles.button,
                styles.acceptScoresButton,
                this.state.scores.length < 6 ?
                  { opacity: 0.5 } :
                  { opacity: 1 },
              ]}
              onPress={() => this.acceptRolls()}
              underlayColor="#1A237E"
              disabled={this.state.scores.length < 6}
            >
              <Text style={styles.buttonText}>Proceed</Text>
            </TouchableHighlight>
            <View style={styles.horizontalLayout}>
              {PointCard(15, 9)}
              {PointCard(14, 7)}
              {PointCard(13, 5)}
            </View>
            <View style={styles.horizontalLayout}>
              {PointCard(12, 4)}
              {PointCard(11, 3)}
              {PointCard(10, 2)}
            </View>
            <View style={styles.horizontalLayout}>
              {PointCard(9, 1)}
              {PointCard(8, 0)}
            </View>
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
  },
  scoreList: {
    flex: 1,
    flexDirection: 'row',
  },
  infoText: {
    fontFamily: 'RobotoLight',
    color: '#000',
    fontSize: 18,
  },
  number: {
    fontFamily: 'RobotoBold',
  },
  scoreLabel: {
    fontFamily: 'RobotoLight',
  },
  generalLabel: {
    color: '#000',
    fontSize: 24,
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
  acceptScoresButton: {
    backgroundColor: '#3F51B5',
    borderColor: '#3F51B5',
    flex: 1,
    marginLeft: 5,
    marginRight: 10,
  },
});
