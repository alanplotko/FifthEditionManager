import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import { Container, Content } from 'native-base';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Card, COLOR, Toolbar } from 'react-native-material-ui';
import { CardStyle, ContainerStyle } from 'FifthEditionManager/stylesheets';

/**
 * Define form options
 */

export default class ScoringMethod extends React.Component {
  static navigationOptions = {
    header: ({ navigation }) => {
      const { routes, index } = navigation.state;
      const props = {
        leftElement: 'arrow-back',
        onLeftElementPress: () => navigation.goBack(routes[index].key),
        centerElement: 'Choose Scoring Method',
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

  selectMethod = (method) => {
    const { navigate, state } = this.props.navigation;
    if (method === 'UseStandardSet') {
      return navigate('AssignAbilityScores', {
        character: state.params.character,
        scores: [15, 14, 13, 12, 10, 8],
      });
    } else if (method === 'ManualEntry') {
      return navigate('AssignAbilityScores', {
        character: state.params.character,
        manualEntry: true,
      });
    }
    return navigate(method, { character: state.params.character });
  }

  render() {
    // Theme setup
    const { standardDiceColor, highlightedDiceColor } = this.context.uiTheme.palette;
    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <View style={ContainerStyle.padded}>
            <Card
              onPress={() => this.selectMethod('RollAbilityScores')}
              style={{ container: CardStyle.container }}
            >
              <Text style={styles.cardHeading}>
                Roll Scores
              </Text>
              <Text style={styles.cardText}>
                Roll four 6-sided dice (4d6) and drop the lowest roll.
                Assign the sum to the desired ability.
                Repeat until all 6 ability scores are determined.
              </Text>
              <View style={styles.diceLayout}>
                <Text style={styles.dicePreText}>Example:</Text>
                <Icon name="dice-4" size={28} color={standardDiceColor} />
                <Icon name="dice-5" size={28} color={standardDiceColor} />
                <Icon name="dice-3" size={28} color={standardDiceColor} />
                <Icon name="dice-2" size={28} color={highlightedDiceColor} />
                <Text style={styles.dicePostText}>= 4 + 5 + 3 = 12</Text>
              </View>
            </Card>
            <Card
              onPress={() => this.selectMethod('UseStandardSet')}
              style={{ container: CardStyle.container }}
            >
              <Text style={styles.cardHeading}>
                Use Standard Set
              </Text>
              <Text style={styles.cardText}>
                Assign to the 6 ability scores from the standard set:
                [15, 14, 13, 12, 10, 8].
              </Text>
            </Card>
            <Card
              onPress={() => this.selectMethod('PointBuyScores')}
              style={{ container: CardStyle.container }}
            >
              <Text style={styles.cardHeading}>
                Point Buy
              </Text>
              <Text style={styles.cardText}>
                You have 27 points to spend on ability scores, where each
                score has a point cost.
              </Text>
            </Card>
            <Card
              onPress={() => this.selectMethod('ManualEntry')}
              style={{ container: CardStyle.container }}
            >
              <Text style={styles.cardHeading}>
                Manual Entry
              </Text>
              <Text style={styles.cardText}>
                Manually enter your scores.
              </Text>
            </Card>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  cardHeading: {
    fontFamily: 'RobotoLight',
    color: COLOR.black,
    fontSize: 24,
    marginBottom: 10,
  },
  cardText: {
    fontFamily: 'Roboto',
    color: COLOR.black,
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
    color: COLOR.grey800,
    fontSize: 18,
    marginRight: 5,
  },
  dicePostText: {
    fontFamily: 'RobotoBold',
    color: COLOR.grey800,
    fontSize: 18,
    marginLeft: 5,
  },
});
