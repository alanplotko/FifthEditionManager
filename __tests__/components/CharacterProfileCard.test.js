import React from 'react';
import PropTypes from 'prop-types';
import CharacterProfileCard from 'FifthEditionManager/components/CharacterProfileCard';
import { View } from 'react-native';
import Modal from 'react-native-modal';

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
    lastUpdated: 0,
    profile: {
      firstName: 'First',
      lastName: 'Last',
      race: { lookupKey: 'Race', name: 'Race' },
      baseClass: { lookupKey: 'Class', name: 'Class' },
      background: { name: 'Background' },
      level: 1,
      experience: 0,
    },
  };
  let timeStub;

  beforeEach(() => {
    timeStub = sinon.stub(Date, 'now').returns(0);
  });

  afterEach(() => {
    timeStub.restore();
  });

  test('returns null without character', () => {
    const wrapper = shallow(<CharacterProfileCard />);
    expect(wrapper.type()).toEqual(null);
  });

  test('renders properly', () => {
    const wrapper = shallow(<CharacterProfileCard character={character} uiTheme={DefaultTheme} />);
    expect(wrapper).toMatchSnapshot();
  });

  test('can toggle the modal', () => {
    const modalStub = sinon.stub();
    const wrapper = shallow(<CharacterProfileCard
      character={character}
      uiTheme={DefaultTheme}
      modalHandler={modalStub}
    />);
    expect(modalStub.notCalled).toBe(true);
    wrapper.find('IconToggle').props().onPress();
    expect(modalStub.calledOnce).toBe(true);
  });

  test('can select all options in the modal', () => {
    const viewStub = sinon.stub();
    const editStub = sinon.stub();
    const deleteStub = sinon.stub();
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

    // Modal closed
    expect(wrapper).toMatchSnapshot();

    // Open modal
    wrapper.find('CharacterProfileCard').dive().find('IconToggle').props().onPress();
    wrapper.update();
    expect(wrapper.find('ReactNativeModal').children().find('ListItem')).toHaveLength(4);

    // Modal opened
    expect(wrapper).toMatchSnapshot();

    wrapper.find('ReactNativeModal').children().find('ListItem').at(1).props().onPress();
    expect(viewStub.calledOnce).toBe(true);

    wrapper.find('ReactNativeModal').children().find('ListItem').at(2).props().onPress();
    expect(editStub.calledOnce).toBe(true);

    wrapper.find('ReactNativeModal').children().find('ListItem').at(3).props().onPress();
    expect(deleteStub.calledOnce).toBe(true);
  });
});
