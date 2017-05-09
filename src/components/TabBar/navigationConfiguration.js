import { TabNavigator } from 'react-navigation';

import CharactersNavigation from '../Characters/views/CharactersNavigation';
import TeamsNavigation from '../Teams/views/TeamsNavigation';
import SettingsNavigation from '../Settings/views/SettingsNavigation';


const routeConfiguration = {
  CharactersNavigation: { screen: CharactersNavigation },
  TeamsNavigation: { screen: TeamsNavigation },
  SettingsNavigation: { screen: SettingsNavigation },
};

const tabBarConfiguration = {
  tabBarOptions: {
    activeTintColor: 'rgba(155, 89, 182, 1.0)',
    inactiveTintColor: 'rgba(149, 165, 166, 1.0)',
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
