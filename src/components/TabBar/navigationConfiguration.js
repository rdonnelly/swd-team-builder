import { TabNavigator } from 'react-navigation';

import CharactersNavigation from '../Characters/views/CharactersNavigation';
import TeamsNavigation from '../Teams/views/TeamsNavigation';


const routeConfiguration = {
  CharactersNavigation: { screen: CharactersNavigation },
  TeamsNavigation: { screen: TeamsNavigation },
};

const tabBarConfiguration = {
  // ...other configs
  tabBarOptions: {
    // tint color is passed to text and icons (if enabled) on the tab bar
    activeTintColor: '#8557A0',
    inactiveTintColor: 'gray',
    // background color is for the tab component
    // activeBackgroundColor: 'blue',
    // inactiveBackgroundColor: 'white',
  },
};

export const TabBar = TabNavigator(routeConfiguration, tabBarConfiguration);

export const tabBarReducer = (state, action) => {
  if (action.type === 'JUMP_TO_TAB') {
    return { ...state, index: 0 };
  }

  return TabBar.router.getStateForAction(action, state);
};
