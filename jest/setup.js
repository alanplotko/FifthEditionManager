import Enzyme, { shallow } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import MockStorage from 'FifthEditionManager/jest/MockStorage';
import { ACTIVITY_KEY, CAMPAIGN_KEY, CHARACTER_KEY } from 'FifthEditionManager/config/StoreKeys';

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

require('react-native-mock-render/mock');

// Mock components
jest.mock('ScrollView', () => {
  // eslint-disable-next-line global-require
  const mockComponent = require('react-native/jest/mockComponent');
  return mockComponent('ScrollView');
});
jest.mock('View', () => 'View');
jest.mock('react-native-material-ui/src/Icon', () => 'Icon');
jest.mock('react-native-material-ui/src/IconToggle', () => 'IconToggle');
jest.mock('react-native-material-ui/src/Checkbox', () => 'Checkbox');
jest.mock('react-native-material-ui/src/Toolbar', () => 'Toolbar');
jest.mock('moment', () => {
  const moment = require.requireActual('moment');
  return moment.utc;
});

// Mock character background options to add more test cases than the default background covers
jest.mock('FifthEditionManager/config/Info/Backgrounds');

const AsyncStorage = new MockStorage({});
jest.setMock('AsyncStorage', AsyncStorage);

// Make available in all test files without importing
global.shallow = shallow;
global.sinon = sinon;
global.AsyncStorage = AsyncStorage;
global.ACTIVITY_KEY = ACTIVITY_KEY;
global.CAMPAIGN_KEY = CAMPAIGN_KEY;
global.CHARACTER_KEY = CHARACTER_KEY;
