import renderer from 'react-test-renderer';
import React from 'react';
import store from 'react-native-simple-store';
import { ACTIVITY_KEY, CAMPAIGN_KEY, CHARACTER_KEY }
  from 'DNDManager/config/StoreKeys';
import App from './App';

it('renders without crashing', () => {
  store
    .update([ACTIVITY_KEY, CAMPAIGN_KEY, CHARACTER_KEY], [[], [], []])
    .then(() => {
      const rendered = renderer.create(<App />).toJSON();
      expect(rendered).toBeTruthy();
    });
});
