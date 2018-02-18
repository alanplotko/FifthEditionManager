import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import { Container, Content } from 'native-base';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Card, COLOR, Toolbar } from 'react-native-material-ui';
import { ContainerStyle } from 'FifthEditionManager/stylesheets';

/**
 * Define form options
 */

export default class ChooseScoringMethod extends React.Component {
  static navigationOptions = {
    header: ({ navigation }) => {
      const props = {
        leftElement: 'arrow-back',
        onLeftElementPress: () => navigation.goBack(),
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
    const params = { ...state.params };
    if (method === 'AssignAbilityScores') {
      params.scores = [15, 14, 13, 12, 10, 8];
    }
    navigate(method, params);
  }

  render() {
    // Theme setup
    const { standardDiceColor, highlightedDiceColor } = this.context.uiTheme.palette;
    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <View style={{ marginHorizontal: 10, marginVertical: 20 }}>
            <Card
              onPress={() => this.selectMethod('RollAbilityScores')}
              style={{ container: { marginBottom: 20, padding: 20 } }}
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
              onPress={() => this.selectMethod('AssignAbilityScores')}
              style={{ container: { marginBottom: 20, padding: 20 } }}
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
              style={{ container: { marginBottom: 20, padding: 20 } }}
            >
              <Text style={styles.cardHeading}>
                Point Buy
              </Text>
              <Text style={styles.cardText}>
                You have 27 points to spend on ability scores, where each
                score has a point cost.
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
