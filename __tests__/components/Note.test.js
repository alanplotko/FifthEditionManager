import React from 'react';
import { Text } from 'react-native';
import Note from 'FifthEditionManager/components/Note';

// Define wrapper component for testing interaction with child Note component
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
    // Use consistent date for tests
    timeStub = sinon.stub(Date, 'now').returns(0);
  });

  afterEach(() => {
    timeStub.restore();
  });

  test('catches missing note handler when collapsible', () => {
    // Spy setup for ensuring prop check occurs; stub console error warnings
    const notePropSpy = sinon.spy(Note.propTypes, 'toggleNoteHandler');
    const consoleStub = sinon.stub(console, 'error');

    // Expect error message
    const errorMessage = 'Prop `toggleNoteHandler` not supplied to `Note`. Required when note is collapsible. Validation failed.';
    expect(notePropSpy.notCalled).toBe(true);
    shallow(<Note title="Error" icon="error" type="error" collapsible isCollapsed><Text>An error occurred!</Text></Note>);
    expect(notePropSpy.calledOnce).toBe(true);
    expect(notePropSpy.alwaysReturned(sinon.match({ message: errorMessage }))).toBe(true);

    // Clean up spy/stub
    notePropSpy.restore();
    consoleStub.restore();
  });

  test('catches invalid note handler when collapsible', () => {
    // Spy setup for ensuring prop check occurs; stub console error warnings
    const notePropSpy = sinon.spy(Note.propTypes, 'toggleNoteHandler');
    const consoleStub = sinon.stub(console, 'error');

    // Expect error message
    const errorMessage = 'Invalid prop `toggleNoteHandler` supplied to `Note`. Type `function` expected. Validation failed.';
    expect(notePropSpy.notCalled).toBe(true);
    shallow(<Note title="Error" icon="error" type="error" collapsible isCollapsed toggleNoteHandler="Invalid Type"><Text>An error occurred!</Text></Note>);
    expect(notePropSpy.calledOnce).toBe(true);
    expect(notePropSpy.alwaysReturned(sinon.match({ message: errorMessage }))).toBe(true);

    // Clean up spy/stub
    notePropSpy.restore();
    consoleStub.restore();
  });

  test('renders properly as error note with error type', () => {
    const wrapper = shallow(<Note title="Error" icon="error" type="error"><Text>An error occurred!</Text></Note>);
    expect(wrapper).toMatchSnapshot();
  });

  test('renders properly as info note with info type', () => {
    const wrapper = shallow(<Note title="Info" icon="info" type="info"><Text>Information here.</Text></Note>);
    expect(wrapper).toMatchSnapshot();
  });

  test('renders properly as info note with tip type', () => {
    const wrapper = shallow(<Note title="Tip" icon="lightbulb-outline" type="tip"><Text>Tip here.</Text></Note>);
    expect(wrapper).toMatchSnapshot();
  });

  test('can expand and collapse properly', () => {
    const wrapper = shallow(<NoteWrapper />);

    // Note should be collapsed by default
    expect(wrapper.dive()).toMatchSnapshot();
    expect(wrapper.dive().find('Text').last().dive().text()).toEqual('collapsed');

    // User must press the 'dropdown arrow' icon to expand the note
    wrapper.dive().find('IconToggle').props().onPress();
    wrapper.update();

    // Note should be expanded for the first time
    expect(wrapper.dive()).toMatchSnapshot();
    expect(wrapper.dive().find('Text').last().dive().text()).toEqual('expanded');

    // User must press the 'dropdown arrow' icon to collapse the note
    wrapper.dive().find('IconToggle').props().onPress();
    wrapper.update();

    // Note should be collapsed again
    expect(wrapper.dive()).toMatchSnapshot();
    expect(wrapper.dive().find('Text').last().dive().text()).toEqual('collapsed');
  });
});
