import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, StyleSheet, View, Text, Image } from 'react-native';
import { Container, Content } from 'native-base';
import { Button, Card, COLOR, Icon, Toolbar, ListItem }
  from 'react-native-material-ui';
import { RACES } from 'DNDManager/config/Info';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';

const uuidv4 = require('uuid/v4');
const Chance = require('chance');

const chance = new Chance();

// 15 margin = (5 margin * 2 sides) + 5 spacing per avatar
const AVATAR_MARGIN = 15;
// 25 = race name text height (estimation)
const TEXT_HEIGHT = 25;

export default class SetCharacterRace extends React.Component {
  static navigationOptions = {
    header: ({ navigation }) => {
      const { routes, index } = navigation.state;
      const props = {
        leftElement: 'arrow-back',
        onLeftElementPress: () => navigation.goBack(),
        centerElement: 'Character Race',
        rightElement: 'autorenew',
        onRightElementPress: () => routes[index].params.randomizeRace(),
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
      race: null,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      randomizeRace: this.randomizeRace,
    });
  }

  orientationHandler = dims =>
    this.setState({ width: dims.window.width, height: dims.window.height });

  componentWillMount() {
    Dimensions.addEventListener("change", this.orientationHandler);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.orientationHandler);
  }

  onPress = () => {
    if (this.state.race) {
      const { navigate } = this.props.navigation;
      const timestamp = Date.now();
      const profile = Object.assign({}, {
        race: {
          lookupKey: this.state.race.key,
          name: this.state.race.name,
        },
      });

      // Set up new character object
      const newCharacter = {
        key: uuidv4(),
        profile,
        created: timestamp,
        lastUpdated: timestamp,
      };

      navigate('SetCharacterClass', { character: newCharacter });
    }
  }

  setRace = (key) => {
    this.setState({
      race: this.state.race && this.state.race.key === key ? null :
        RACES.find(race => race.key === key),
    });
  }

  randomizeRace = () => {
    this.setState({ race: chance.pickone(RACES) });
  }

  render() {
    const avatarCount = this.state.width > this.state.height ? 5 : 3;
    const maxSize = (this.state.width / avatarCount) - AVATAR_MARGIN;
    const iconSize = maxSize / 2;
    const iconBorderRadius = iconSize / 2;
    const spacing = {
      top: (maxSize - iconSize - TEXT_HEIGHT) / 2,
      left: (maxSize - iconSize) / 2,
    };
    const buttonMargin = (this.state.width - (maxSize * (avatarCount - 1))) / 2;

    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <View style={{ flex: 1, marginHorizontal: 0, marginVertical: 20 }}>
            <View
              style={[
                styles.centered, { flexWrap: 'wrap', alignItems: 'flex-start' },
              ]}
            >
              {RACES.map(race => (
                <Card
                  key={race.key}
                  style={{
                    container: {
                      width: maxSize,
                      height: maxSize,
                      marginHorizontal: 5,
                      marginVertical: 5,
                    },
                  }}
                  onPress={() => this.setRace(race.key)}
                >
                  <Image
                    style={{ width: maxSize, height: maxSize }}
                    source={race.image}
                    blurRadius={
                      this.state.race && this.state.race.key === race.key ?
                        10 : 0
                    }
                  />
                  <Text style={styles.label}>{race.name}</Text>
                  {
                    this.state.race && this.state.race.key === race.key &&
                    <Icon
                      name="check-circle"
                      color={COLOR.green500}
                      size={iconSize}
                      style={{
                        position: 'absolute',
                        top: spacing.top,
                        left: spacing.left,
                        backgroundColor: COLOR.white,
                        borderRadius: iconBorderRadius,
                      }}
                    />
                  }
                </Card>
              ))}
            </View>
            <View
              style={[
                styles.centered,
                { flex: 1, marginHorizontal: buttonMargin, marginVertical: 20 }
              ]}
            >
              <Button
                primary
                raised
                disabled={!this.state.race}
                onPress={this.onPress}
                text="Proceed"
                style={{
                  container: {
                    flex: 1,
                    height: 40,
                  },
                }}
              />
            </View>
            <View style={[styles.centered, { flex: 1, marginHorizontal: 20 }]}>
              {
                this.state.race &&
                <Card style={{ container: { padding: 15 } }}>
                  <Text style={styles.cardHeading}>
                    {this.state.race.name}
                    </Text>
                  <Text style={styles.cardText}>
                    {this.state.race.description}
                    </Text>
                </Card>
              }
              {
                !this.state.race &&
                <Card style={{ container: { padding: 20 } }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon
                      name="info"
                      style={{
                        color: '#ccc',
                        fontSize: 48,
                        width: 48,
                        height: 48,
                        marginRight: 10,
                      }} />
                    <Text style={styles.placeholderMessage}>
                      Selection details will display here
                    </Text>
                  </View>
                </Card>
              }
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  cardHeading: {
    fontFamily: 'RobotoLight',
    color: '#000',
    fontSize: 24,
  },
  cardText: {
    fontFamily: 'Roboto',
    color: '#666',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    position: 'absolute',
    bottom: 5,
    width: '100%',
    fontFamily: 'RobotoBold',
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    textAlign: 'center',
  },
  placeholderMessage: {
    fontFamily: 'RobotoLight',
    color: '#666',
    fontSize: 18,
  },
});
