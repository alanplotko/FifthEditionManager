import React from 'react';
import ActivityCard from 'FifthEditionManager/components/ActivityCard';
import { cloneDeep } from 'lodash';

describe('Activity Card', () => {
  const activity = {
    thumbnail: 1,
    action: 'Created a new character!',
    extra: 'First Last',
    timestamp: Date.now(),
    icon: {
      name: 'add',
      color: '#fff',
    },
  };

  test('renders properly with icon', () => {
    const wrapper = shallow(<ActivityCard activity={activity} uiTheme={DefaultTheme} />);
    expect(wrapper).toMatchSnapshot();
  });

  test('renders properly without icon', () => {
    // Override default activity to have no icon
    const activityNoIcon = cloneDeep(activity);
    activityNoIcon.icon = null;
    const wrapper = shallow(<ActivityCard activity={activityNoIcon} uiTheme={DefaultTheme} />);
    expect(wrapper).toMatchSnapshot();
  });
});
