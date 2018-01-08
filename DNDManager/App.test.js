import renderer from 'react-test-renderer';
import React from 'react';
import App from 'DNDManager/App';

jest.mock('ScrollView', () => {
  /* eslint-disable global-require */
  const mockComponent = require('react-native/jest/mockComponent');
  /* eslint-enable global-require */
  return mockComponent('ScrollView');
});

it('renders without crashing', () => {
  const rendered = renderer.create(<App />).toJSON();
  expect(rendered).toBeTruthy();
});
