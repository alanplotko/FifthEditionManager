import React from 'react';
import PropTypes from 'prop-types';
import CharacterProfileCard from 'FifthEditionManager/components/CharacterProfileCard';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { EXPERIENCE } from 'FifthEditionManager/config/Info';
import { cloneDeep } from 'lodash';

// Define wrapper component for testing interaction with child CharacterProfileCard component
class CharacterProfileCardWrapper extends React.Component {
  static propTypes = {
    character: PropTypes.object.isRequired,
    viewHandler: PropTypes.func.isRequired,
    editHandler: PropTypes.func.isRequired,
    deleteHandler: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      character: props.character,
      modalContent: null,
      isModalVisible: false,
      modalHandler: modalContent => this.setState({ modalContent, isModalVisible: true }),
      viewHandler: props.viewHandler,
      editHandler: props.editHandler,
      deleteHandler: props.deleteHandler,
    };
  }

  render() {
    return (
      <View>
        <CharacterProfileCard {...this.state} />
        <Modal
          isVisible={this.state.isModalVisible}
          onBackButtonPress={() => this.setState({ isModalVisible: false })}
        >
          <View>{this.state.modalContent}</View>
        </Modal>
      </View>
    );
  }
}

describe('Character Profile Card', () => {
  const character = {
    key: 'key',
    meta: {
      lastUpdated: 0,
    },
    race: { lookupKey: 'Race', name: 'Race' },
    baseClass: { lookupKey: 'Class', name: 'Class' },
    background: { lookupKey: 'Background', name: 'Background' },
    profile: {
      firstName: 'First',
      lastName: 'Last',
      level: 1,
      experience: 0,
    },
  };
  let modalStub;
  let viewStub;
  let editStub;
  let deleteStub;
  let timeStub;

  beforeEach(() => {
    // Use consistent date for tests
    timeStub = sinon.stub(Date, 'now').returns(0);

    modalStub = sinon.stub();
    viewStub = sinon.stub();
    editStub = sinon.stub();
    deleteStub = sinon.stub();
  });

  afterEach(() => {
    timeStub.restore();
    modalStub.reset();
    viewStub.reset();
    editStub.reset();
    deleteStub.reset();
  });

  test('renders properly for characters below max level', () => {
    const wrapper = shallow(<CharacterProfileCard
      character={character}
      modalHandler={modalStub}
      viewHandler={viewStub}
      editHandler={editStub}
      deleteHandler={deleteStub}
    />);
    expect(wrapper).toMatchSnapshot();
  });

  test('renders properly for characters at max level', () => {
    // Override default character to have max level
    const characterMaxLevel = cloneDeep(character);
    characterMaxLevel.profile.level = EXPERIENCE.length;
    characterMaxLevel.profile.experience = EXPERIENCE[EXPERIENCE.length - 1];

    const wrapper = shallow(<CharacterProfileCard
      character={characterMaxLevel}
      modalHandler={modalStub}
      viewHandler={viewStub}
      editHandler={editStub}
      deleteHandler={deleteStub}
    />);
    expect(wrapper).toMatchSnapshot();
  });

  test('can toggle the modal', () => {
    const wrapper = shallow(<CharacterProfileCard
      character={character}
      modalHandler={modalStub}
      viewHandler={viewStub}
      editHandler={editStub}
      deleteHandler={deleteStub}
    />);

    // 'More options' icon not pressed
    expect(modalStub.notCalled).toBe(true);

    // User must press the 'more options' icon to open the modal
    wrapper.find('IconToggle').props().onPress();

    // Modal should be open
    expect(modalStub.calledOnce).toBe(true);
  });

  test('can select all options in the modal', () => {
    const wrapper = shallow(<CharacterProfileCardWrapper
      character={character}
      viewHandler={viewStub}
      editHandler={editStub}
      deleteHandler={deleteStub}
    />);

    // No options selected
    expect(viewStub.notCalled).toBe(true);
    expect(editStub.notCalled).toBe(true);
    expect(deleteStub.notCalled).toBe(true);

    // Modal should be closed
    expect(wrapper).toMatchSnapshot();

    // User must press the 'more options' icon to open the modal
    wrapper.find('CharacterProfileCard').dive().find('IconToggle').props().onPress();
    wrapper.update();

    // Modal should be open
    expect(wrapper).toMatchSnapshot();

    // Modal should have 4 rows (character name and the three options: view, edit, delete)
    expect(wrapper.find('ReactNativeModal').children().find('ListItem')).toHaveLength(4);

    // Option handlers should execute on press
    wrapper.find('ReactNativeModal').children().find('ListItem').at(1).props().onPress();
    expect(viewStub.calledOnce).toBe(true);
    wrapper.find('ReactNativeModal').children().find('ListItem').at(2).props().onPress();
    expect(editStub.calledOnce).toBe(true);
    wrapper.find('ReactNativeModal').children().find('ListItem').at(3).props().onPress();
    expect(deleteStub.calledOnce).toBe(true);
  });
});
