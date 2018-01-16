import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ActivityIndicator, TouchableHighlight, View, Text }
  from 'react-native';
import {
  Card,
  CardItem,
  Container,
  Content,
  Icon,
  List,
  ListItem,
  Body,
} from 'native-base';
import { Toolbar } from 'react-native-material-ui';
import { BACKGROUNDS } from 'DNDManager/config/Info';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';
import FormStyle from 'DNDManager/stylesheets/FormStyle';

const t = require('tcomb-form-native');

/**
 * Character ability scores
 */

// Valid ability score is an integer in range [1, 30]
const Score = t.refinement(t.Number, n => n % 1 === 0 && n >= 1 && n <= 30);
Score.getValidationErrorMessage = value => validateInteger(
  value,
  'Range: [1, 30]',
);

const abilities = [
  'strength',
  'dexterity',
  'constitution',
  'intelligence',
  'wisdom',
  'charisma'
];

const ScoreEnum = t.enums({
  15: 15,
  14: 14,
  13: 13,
  12: 12,
  10: 10,
  8: 8,
});

const AbilityScores = t.struct({
  strength: ScoreEnum,
  dexterity: ScoreEnum,
  constitution: ScoreEnum,
  intelligence: ScoreEnum,
  wisdom: ScoreEnum,
  charisma: ScoreEnum,
});

/**
 * Form template setup
 */

const template = locals => (
  <View>
    <View style={FormStyle.horizontalLayout}>
      <View style={{ flex: 1, marginRight: 5 }}>
        {locals.inputs.strength}
      </View>
      <View style={{ flex: 1, marginLeft: 5 }}>
        {locals.inputs.dexterity}
      </View>
    </View>
    <View style={FormStyle.horizontalLayout}>
      <View style={{ flex: 1, marginRight: 5 }}>
        {locals.inputs.constitution}
      </View>
      <View style={{ flex: 1, marginLeft: 5 }}>
        {locals.inputs.intelligence}
      </View>
    </View>
    <View style={FormStyle.horizontalLayout}>
      <View style={{ flex: 1, marginRight: 5 }}>
        {locals.inputs.wisdom}
      </View>
      <View style={{ flex: 1, marginLeft: 5 }}>
        {locals.inputs.charisma}
      </View>
    </View>
  </View>
);


const defineScoreOptions = (scoreItem, index) => {
  return {
    value: scoreItem.score.toString(),
    text: `${scoreItem.score} (${scoreItem.quantity} left)`,
    disabled: scoreItem.quantity === 0,
  };
}

const setUpFieldOptions = (options, bank) => {
  abilities.forEach((ability) => {
    options.fields[ability] = {
      factory: t.form.Select,
      nullOption: { value: '', text: 'None Chosen' },
      options: bank.map(defineScoreOptions),
    };
  });
}

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
      form: null,
      error: null,
      scores: [],
      scoreBank: [],
      ...props.navigation.state.params,
    };

    this.state.scores.forEach((score) => {
      const index = this.state.scoreBank
        .findIndex(s => s.score.toString() === score.toString());
      if (index !== -1) {
        this.state.scoreBank[index].quantity += 1;
      } else {
        this.state.scoreBank.push({ score: score.toString(), quantity: 1 })
      }
    });

    /**
     * Define form options
     */

    this.state.options = {
      template,
      fields: {},
    };
    setUpFieldOptions(this.state.options, this.state.scoreBank);
  }

  onChange = (value, path) => {
    console.log(value);
    const newScoreBank = this.state.scoreBank.slice(0);
    const index = newScoreBank
      .findIndex(s => s.score.toString() === value[path[0]]);
    if (index !== -1) {
      newScoreBank[index].quantity -= 1;
      const newOptions = t.update(this.state.options, {
        fields: {
          strength: {
            options: { '$set': newScoreBank.map(defineScoreOptions) },
          },
          dexterity: {
            options: { '$set': newScoreBank.map(defineScoreOptions) },
          },
          constitution: {
            options: { '$set': newScoreBank.map(defineScoreOptions) },
          },
          intelligence: {
            options: { '$set': newScoreBank.map(defineScoreOptions) },
          },
          wisdom: {
            options: { '$set': newScoreBank.map(defineScoreOptions) },
          },
          charisma: {
            options: { '$set': newScoreBank.map(defineScoreOptions) },
          },
        }
      });
      this.setState({
        form: value,
        options: newOptions,
        scoreBank: newScoreBank,
      }, () => console.log(this.state.options));
    }
  }

  componentWillUnmount() {
    // clearTimeout(this.updateCard);
  }

  // onPress = () => {
  //   const { state, dispatch } = this.props.navigation;
  //   const data = this.form.getValue();
  //   if (data) {
  //     const newCharacter = Object.assign({}, state.params.character);
  //     newCharacter.lastUpdated = Date.now();
  //     newCharacter.profile = Object.assign({}, newCharacter.profile, data);
  //     const newActivity = {
  //       key: uuidv4(),
  //       timestamp: newCharacter.lastUpdated,
  //       action: 'Created New Character',
  //       // Format character's full name for extra text
  //       extra: `${newCharacter.profile.firstName.charAt(0).toUpperCase()}${newCharacter.profile.firstName.slice(1)} ${newCharacter.profile.lastName.charAt(0).toUpperCase()}${newCharacter.profile.lastName.slice(1)}`,
  //       thumbnail: newCharacter.profile.images.race,
  //       icon: {
  //         name: 'add-circle',
  //         color: '#fff',
  //       },
  //     };
  //     store
  //       .push(CHARACTER_KEY, newCharacter)
  //       .catch((error) => {
  //         // Show error message on screen and allow resubmit
  //         this.setState({ error: 'Please try again in a few minutes.' });
  //         return error;
  //       })
  //       .then((error) => {
  //         if (error) return;
  //         store
  //           .push(ACTIVITY_KEY, newActivity)
  //           .then(() => {
  //             const resetAction = NavigationActions.reset({
  //               index: 0,
  //               actions: [NavigationActions.navigate({
  //                 routeName: 'Home',
  //               })],
  //             });
  //             dispatch(resetAction);
  //           });
  //       });
  //   }
  // }

  render() {
    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <View style={{ margin: 20 }}>
            <Text style={FormStyle.heading}>Character Ability Scores</Text>
            {
              this.state.error &&
              <View style={styles.errorDialog}>
                <Text style={styles.errorHeading}>
                  An error occurred!
                </Text>
                <Text style={styles.errorText}>
                  {this.state.error.message}&nbsp;
                </Text>
              </View>
            }
            <t.form.Form
              ref={(c) => { this.form = c; }}
              type={AbilityScores}
              value={this.state.form}
              options={this.state.options}
              onChange={(v,p) => this.onChange(v,p)}
            />
            <TouchableHighlight
              style={[
                FormStyle.submitBtn,
                this.state.isSelectionLoading ?
                  { opacity: 0.5 } :
                  { opacity: 1 },
                { marginTop: 0, marginBottom: 10 },
              ]}
              onPress={this.onPress}
              underlayColor="#1A237E"
              disabled={this.state.isSelectionLoading}
            >
              <Text style={FormStyle.submitBtnText}>
                Set Ability Scores
              </Text>
            </TouchableHighlight>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  absoluteCentered: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
  },
  listItemHeading: {
    fontFamily: 'RobotoBold',
    color: '#000',
    fontSize: 20,
  },
  infoHeading: {
    fontFamily: 'RobotoBold',
    color: '#000',
    fontSize: 16,
    paddingLeft: 10,
  },
  infoText: {
    fontFamily: 'Roboto',
    color: '#666',
    fontSize: 14,
    paddingLeft: 10,
  },
  displayCardHeading: {
    fontFamily: 'RobotoLight',
    color: '#666',
    fontSize: 18,
  },
  messageIcon: {
    color: '#ccc',
    fontSize: 48,
    width: 48,
    height: 48,
    marginRight: 10,
  },
  loading: {
    opacity: 0.1,
  },
  selectedListItem: {
    opacity: 0.2,
    backgroundColor: '#b2f0b2',
  },
  selectedText: {
    fontFamily: 'RobotoLight',
    color: '#000',
    fontSize: 48,
  },
  errorDialog: {
    backgroundColor: '#F44336',
    marginBottom: 15,
    padding: 15,
    borderRadius: 3,
  },
  errorHeading: {
    fontFamily: 'RobotoBold',
    color: '#fff',
    fontSize: 18,
  },
  errorText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 14,
  },
});
