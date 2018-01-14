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
import { roll, validateInteger } from 'DNDManager/util';

/**
 * Define form options
 */

export default class ChoseScoringMethod extends React.Component {
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

  constructor(props) {
    super(props);
  }

  render() {
    const { navigate, state } = this.props.navigation;
    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <View style={{ marginHorizontal: 10, marginVertical: 20 }}>
            <Card
              onPress={() => navigate('RollAbilityScores', {...state.params})}
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
                <Text style={styles.dicePreText}>
                  Example:
                </Text>
                <Icon
                  name="dice-4"
                  size={28}
                  color="#333"
                />
                <Icon
                  name="dice-5"
                  size={28}
                  color="#333"
                />
                <Icon
                  name="dice-3"
                  size={28}
                  color="#333"
                />
                <Icon
                  name="dice-2"
                  size={28}
                  color={COLOR.red500}
                />
                <Text style={styles.dicePostText}>
                  = 4 + 5 + 3 = 12
                </Text>
              </View>
            </Card>
              <Card
                onPress={() => {}}
                style={{ container: { marginBottom: 20, padding: 20 } }}
              >
                <Text style={styles.cardHeading}>
                  Use Standard Set
                </Text>
                <Text style={styles.cardText}>
                  Assign to the 6 ability scores from the standard set
                  [15, 14, 13, 12, 10, 8].
                </Text>
              </Card>
              <Card
                onPress={() => navigate('PointBuyScores', {...state.params})}
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
  modalView: {
    backgroundColor: 'transparent',
  },
});
