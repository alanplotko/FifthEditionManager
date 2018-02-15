import React from 'react';
import PropTypes from 'prop-types';
import {
  Keyboard,
  TouchableHighlight,
  Text,
  ScrollView,
  View,
} from 'react-native';
import { Container, Content } from 'native-base';
import { Toolbar } from 'react-native-material-ui';
import ContainerStyle from 'FifthEditionManager/stylesheets/ContainerStyle';
import { ALIGNMENTS, EXPERIENCE } from 'FifthEditionManager/config/Info';
import FormStyle from 'FifthEditionManager/stylesheets/FormStyle';
import { validateInteger } from 'FifthEditionManager/util';

const t = require('tcomb-form-native');
const Chance = require('chance');

const chance = new Chance();

/**
 * Form valdiation setup
 */

// Integer in range [1, 20]
const Level = t.refinement(t.Number, n => n % 1 === 0 && n > 0 && n <= 20);
Level.getValidationErrorMessage = value => validateInteger(
  value,
  'Integer in range [1, 20]',
);

// Integer >= 0
const Experience = t.refinement(t.Number, n => n % 1 === 0 && n >= 0);
Experience.getValidationErrorMessage = value => validateInteger(
  value,
  'Minimum of 0',
);

// Integer >= 1
const Age = t.refinement(t.Number, n => n % 1 === 0 && n >= 1);
Age.getValidationErrorMessage = value => validateInteger(value, 'Minimum of 1');

const getExperienceRange = (level) => {
  const range = {
    min: null,
    max: null,
  };
  if (level === 20) {
    range.min = EXPERIENCE[level - 1];
  } else if (level >= 1 && level < 20) {
    range.min = EXPERIENCE[level - 1];
    range.max = EXPERIENCE[level] - 1;
  }
  return range;
};

const isInExperienceRange = (experience, range) => (
  range.max === null ?
    experience >= range.min :
    experience >= range.min && experience <= range.max
);

const Power = t.refinement(t.struct({
  level: Level,
  experience: Experience,
}), power => isInExperienceRange(
  power.experience,
  getExperienceRange(power.level),
));

Power.getValidationErrorMessage = (value) => {
  const range = getExperienceRange(value.level);
  if (range.max === null) {
    return `Level ${value.level} has a minimum of ${range.min} experience`;
  }
  return `Level ${value.level} experience range [${range.min}, ${range.max}]`;
};

const defaultError = () => 'Required';
t.Number.getValidationErrorMessage = defaultError;
t.String.getValidationErrorMessage = defaultError;

/**
 * Define character
 */

const AlignmentType = ALIGNMENTS.reduce((o, alignment) =>
 Object.assign(o, { [alignment]: alignment }), {});
const Character = t.struct({
  power: Power,
  firstName: t.String,
  lastName: t.String,
  gender: t.enums({
    Male: 'Male',
    Female: 'Female',
    Other: 'Other',
  }),
  alignment: t.enums(AlignmentType),
  age: Age,
  height: t.String,
  weight: t.String,
});

/**
 * Form template setup
 */

const template = locals => (
  <View>
    <Text style={FormStyle.heading}>Character Name</Text>
    <View style={FormStyle.horizontalLayout}>
      <View style={{ flex: 1, marginRight: 5 }}>
        {locals.inputs.firstName}
      </View>
      <View style={{ flex: 1, marginLeft: 5 }}>
        {locals.inputs.lastName}
      </View>
    </View>

    <Text style={FormStyle.heading}>Power</Text>
    {locals.inputs.power}

    <Text style={FormStyle.heading}>About</Text>
    <View style={FormStyle.horizontalLayout}>
      <View style={{ flex: 1 }}>
        {locals.inputs.gender}
      </View>
      <View style={{ flex: 1 }}>
        {locals.inputs.alignment}
      </View>
    </View>

    <Text style={FormStyle.heading}>Measurements</Text>
    <View style={{ flex: 1, marginRight: 5 }}>
      {locals.inputs.age}
    </View>
    <View style={{ flex: 1, marginLeft: 5, marginRight: 5 }}>
      {locals.inputs.height}
    </View>
    <View style={{ flex: 1, marginLeft: 5 }}>
      {locals.inputs.weight}
    </View>
  </View>
);

/**
 * Define form options
 */

const options = {
  template,
  fields: {
    firstName: {
      label: 'First Name',
    },
    lastName: {
      label: 'Last Name',
    },
    power: {
      auto: 'none',
      fields: {
        level: {
          label: 'Level',
          help: 'Integer in range [1, 20]',
        },
        experience: {
          label: 'Experience Points',
          help: 'Select valid level to view range',
        },
      },
    },
    gender: {
      label: 'Gender',
      nullOption: { value: '', text: 'Select Gender' },
    },
    alignment: {
      label: 'Alignment',
      nullOption: { value: '', text: 'Select Alignment' },
    },
    age: {
      label: 'Age',
      help: 'In years',
    },
    height: {
      label: 'Height',
      help: 'e.g. 5\'5"',
    },
    weight: {
      label: 'Weight',
      help: 'e.g. 130 lbs.',
    },
  },
};

export default class SetUpProfile extends React.Component {
  static navigationOptions = {
    header: ({ navigation }) => {
      const { routes, index } = navigation.state;
      const props = {
        leftElement: 'arrow-back',
        onLeftElementPress: () => navigation.goBack(),
        centerElement: 'New Character',
        rightElement: 'autorenew',
        onRightElementPress: () => routes[index].params.generateCharacter(),
      };
      return <Toolbar {...props} />;
    },
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      options,
      form: null,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      generateCharacter: this.generateCharacter,
    });
  }

  onPress = () => {
    Keyboard.dismiss();
    const generalInfo = this.form.getValue();
    if (generalInfo) {
      const { navigate, state } = this.props.navigation;
      const newCharacter = Object.assign({}, state.params.character);
      newCharacter.lastUpdated = Date.now();
      newCharacter.profile = Object.assign({}, newCharacter.profile, generalInfo);

      // Flatten nested power object
      newCharacter.profile.level = newCharacter.profile.power.level;
      newCharacter.profile.experience = newCharacter.profile.power.experience;
      delete newCharacter.profile.power;

      navigate('ChooseScoringMethod', { character: newCharacter });
    }
  }

  onChange = (value) => {
    let helpText = 'Select valid level to view range';
    if (value && Object.prototype.hasOwnProperty.call(value, 'power') &&
        Object.prototype.hasOwnProperty.call(value.power, 'level') &&
        value.power.level.length > 0) {
      const level = parseInt(value.power.level, 10);
      const range = getExperienceRange(level);
      if (range.min !== null) {
        if (range.max === null) {
          helpText = `Minimum of ${range.min}`;
        } else {
          helpText = `Range [${range.min}, ${range.max}]`;
        }
      }
    }
    const updatedOptions = t.update(this.state.options, {
      fields: {
        power: {
          fields: {
            experience: {
              help: { $set: helpText },
            },
          },
        },
      },
    });
    this.setState({ options: updatedOptions, form: value });
  }

  generateCharacter = () => {
    let gender;
    let firstName;
    let lastName;
    if (chance.bool()) {
      gender = 'Other';
      firstName = chance.first();
      lastName = chance.last();
    } else {
      gender = chance.gender();
      firstName = chance.first({ gender });
      lastName = chance.last({ gender });
    }
    this.setState({
      form: {
        firstName,
        lastName,
        power: { level: 1, experience: 0 },
        gender,
        alignment: chance.pickone(ALIGNMENTS),
        // Age min/max: Human/Elf
        age: chance.natural({ min: 10, max: 800 }),
        // Height min/max: Halfling/Dragonborn
        height: `${chance.natural({ min: 3, max: 6 })}'${chance.natural({ min: 1, max: 12 })}"`,
        // Weight min/max: Halfling/Dragonborn
        weight: `${chance.natural({ min: 70, max: 250 })} lbs.`,
      },
    });
  }

  render() {
    // Update form options for focus on next field
    const fieldOrder = [
      ['firstName'],
      ['lastName'],
      ['power', 'level'],
      ['power', 'experience'],
      ['age'],
      ['height'],
      ['weight'],
    ];
    fieldOrder.forEach((name, index) => {
      if (index + 1 < fieldOrder.length) {
        if (name.length === 1) {
          options.fields[name[0]].onSubmitEditing = () => {
            this.form.getComponent(fieldOrder[index + 1]).refs.input.focus();
          };
        } else {
          // Traverse to nensted field
          options.fields[name[0]].fields[name[1]].onSubmitEditing = () => {
            this.form.getComponent(fieldOrder[index + 1]).refs.input.focus();
          };
        }
      }
    });

    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <ScrollView style={{ margin: 20 }} keyboardShouldPersistTaps="always">
            <t.form.Form
              ref={(c) => { this.form = c; }}
              type={Character}
              value={this.state.form}
              options={this.state.options}
              onChange={this.onChange}
            />
            <TouchableHighlight
              style={FormStyle.submitBtn}
              onPress={this.onPress}
              underlayColor="#1A237E"
            >
              <Text style={FormStyle.submitBtnText}>Save Character</Text>
            </TouchableHighlight>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
