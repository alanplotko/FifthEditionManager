import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableHighlight, View, Text } from 'react-native';
import { Container, Content } from 'native-base';
import { Card, COLOR, IconToggle, ListItem, Toolbar }
  from 'react-native-material-ui';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';
import { formatSingleDigit, reverseSort } from 'DNDManager/util';

const initialState = {
  points: 27,
  scores: [],
  scoreSet: {
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
  },
};

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
    this.state = initialState;
  }

  acceptRolls = () => {
    const { navigate, state } = this.props.navigation;
    navigate('AssignAbilityScores', {
      scores: this.state.scores,
      ...state.params,
    });
  }

  resetScores = () => this.setState(initialState);

  render() {
    const cannotBuy = cost => this.state.points < cost ||
      this.state.scores.length === 6;
    const cannotSell = score => this.state.scoreSet[score.toString()] === 0;
    const options = [
      { score: 15, cost: 9 },
      { score: 14, cost: 7 },
      { score: 13, cost: 5 },
      { score: 12, cost: 4 },
      { score: 11, cost: 3 },
      { score: 10, cost: 2 },
      { score: 9, cost: 1 },
      { score: 8, cost: 0 },
    ];

    const ListItemRow = (score, cost) => (
      <ListItem
        key={score}
        divider
        leftElement={
          <IconToggle
            name="arrow-drop-down"
            size={36}
            percent={50}
            color="#000"
            onPress={() => {
              const scoreSet = Object.assign({}, this.state.scoreSet);
              const scores = [...this.state.scores];
              scoreSet[score.toString()] -= 1;
              const points = this.state.points + cost;
              if (scores.length === 0 || scoreSet[score.toString()] < 0) {
                return;
              }
              scores.splice(scores.indexOf(score), 1);
              this.setState({ points, scores, scoreSet });
            }}
            disabled={cannotSell(score)}
          />
        }
        centerElement={
          <View style={styles.horizontalLayout}>
            <Text style={styles.smallHeading}>
              {formatSingleDigit(score)}
            </Text>
            <Text style={styles.smallHeading}>
              {cost}
            </Text>
            <Text style={[styles.smallHeading, styles.makeBold]}>
              {this.state.scoreSet[score.toString()]}
            </Text>
          </View>
        }
        rightElement={
          <IconToggle
            name="arrow-drop-up"
            size={36}
            percent={50}
            color="#000"
            onPress={() => {
              const scoreSet = Object.assign({}, this.state.scoreSet);
              const scores = [...this.state.scores];
              scoreSet[score.toString()] += 1;
              const points = this.state.points - cost;
              if (scores.length === 6 || points < 0) {
                return;
              }
              scores.push(score);
              scores.sort(reverseSort);
              this.setState({ points, scores, scoreSet });
            }}
            disabled={cannotBuy(cost)}
          />
        }
      />
    );
    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <View style={{ margin: 20 }}>
            <Card
              style={{ container: { marginBottom: 10, padding: 10 } }}
            >
              <Text style={styles.bigHeading}>
                <Text style={styles.makeBold}>
                  {this.state.points}
                </Text>
                &nbsp;Points Remaining
              </Text>
              <View style={styles.scoreList}>
                <Text style={styles.bigHeading}>
                  Scores:&nbsp;
                  {
                    this.state.scores.length === 0 &&
                    'None'
                  }
                </Text>
                <Text style={[styles.bigHeading, styles.makeBold]}>
                  {this.state.scores.join(', ')}
                </Text>
              </View>
            </Card>
            <View style={styles.buttonLayout}>
              <TouchableHighlight
                style={[
                  styles.button,
                  styles.resetButton,
                  this.state.scores.length === 0 ?
                    { opacity: 0.5 } :
                    { opacity: 1 },
                ]}
                onPress={() => this.resetScores()}
                color={COLOR.red500}
                underlayColor={COLOR.red800}
                disabled={this.state.scores.length === 0}
              >
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableHighlight>
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
                <Text style={styles.buttonText}>
                  {
                    (6 - this.state.scores.length) > 0 ?
                      `${6 - this.state.scores.length} Scores Remaining` :
                      'Proceed'
                  }
                </Text>
              </TouchableHighlight>
            </View>
            <ListItem
              divider
              centerElement={
                <View style={styles.horizontalLayout}>
                  <Text style={{ paddingHorizontal: 20 }} />
                  <Text style={styles.smallHeading}>Score</Text>
                  <Text style={styles.smallHeading}>Cost (Points)</Text>
                  <Text style={styles.smallHeading}>Used</Text>
                  <Text style={{ paddingHorizontal: 20 }} />
                </View>
              }
            />
            {
              options.map(option =>
                ListItemRow(option.score, option.cost))
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
