import React from 'react';
import { Text } from 'react-native';
import Note from 'FifthEditionManager/components/Note';

class NoteWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'collapsed',
      children: <Text>expanded</Text>,
      icon: 'info',
      type: 'info',
      collapsible: true,
      isCollapsed: true,
      toggleNoteHandler: this.toggleNote.bind(this),
    };
  }

  toggleNote = () => this.setState({ isCollapsed: !this.state.isCollapsed });

  render() {
    return <Note {...this.state} />;
  }
}

describe('Note', () => {
  let timeStub;

  beforeEach(() => {
    timeStub = sinon.stub(Date, 'now').returns(0);
  });

  afterEach(() => {
    timeStub.restore();
  });

  test('renders as error note with error type', () => {
    const wrapper = shallow(<Note title="Error" icon="error" type="error"><Text>An error occurred!</Text></Note>);
    expect(wrapper).toMatchSnapshot();
  });

  test('renders as info note with info type', () => {
    const wrapper = shallow(<Note title="Info" icon="info" type="info"><Text>Information here.</Text></Note>);
    expect(wrapper).toMatchSnapshot();
  });

  test('can expand and collapse properly', () => {
    const wrapper = shallow(<NoteWrapper />);

    // Collapsed by default
    expect(wrapper.dive()).toMatchSnapshot();
    expect(wrapper.dive().find('Text').last().dive().text()).toEqual('collapsed');

    // Toggle to expand
    wrapper.dive().find('IconToggle').props().onPress();
    wrapper.update();

    // Expanded for the first time
    expect(wrapper.dive()).toMatchSnapshot();
    expect(wrapper.dive().find('Text').last().dive().text()).toEqual('expanded');

    // Toggle to collapse
    wrapper.dive().find('IconToggle').props().onPress();
    wrapper.update();

    // Collapsed again
    expect(wrapper.dive()).toMatchSnapshot();
    expect(wrapper.dive().find('Text').last().dive().text()).toEqual('collapsed');
  });
});
