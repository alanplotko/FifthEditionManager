import Enzyme, { shallow } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import { uiTheme } from 'FifthEditionManager/App';

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

require('react-native-mock-render/mock');

// Ignore React Web errors when using React Native
console.error = message => message; // eslint-disable-line no-console

// Mock components
jest.mock('ScrollView', () => {
  // eslint-disable-next-line global-require
  const mockComponent = require('react-native/jest/mockComponent');
  return mockComponent('ScrollView');
});
jest.mock('react-native-material-ui/src/Icon', () => 'Icon');

// Make Enzyme functions, sinon, and UI theme available in all test files without importing
global.shallow = shallow;
global.sinon = sinon;
global.uiTheme = uiTheme;
