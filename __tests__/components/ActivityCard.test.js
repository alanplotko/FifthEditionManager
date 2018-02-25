import React from 'react';
import ActivityCard from 'FifthEditionManager/components/ActivityCard';

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

  test('returns null without activity', () => {
    const wrapper = shallow(<ActivityCard />);
    expect(wrapper.type()).toEqual(null);
  });

  test('renders properly', () => {
    const wrapper = shallow(<ActivityCard activity={activity} uiTheme={DefaultTheme} />);
    expect(wrapper).toMatchSnapshot();
  });
});
