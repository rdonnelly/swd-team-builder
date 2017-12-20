import { TabNavigator } from 'react-navigation';

import CharacterNavigation from '../../screens/Characters/views/CharacterNavigation';
import TeamNavigation from '../../screens/Teams/views/TeamNavigation';
import SettingsNavigation from '../../screens/Settings/views/SettingsNavigation';


const routeConfiguration = {
  Characters: { screen: CharacterNavigation },
  Teams: { screen: TeamNavigation },
  Settings: { screen: SettingsNavigation },
};

const tabBarConfiguration = {
  backBehavior: 'none',
  lazy: true,
  tabBarOptions: {
    activeTintColor: 'rgba(155, 89, 182, 1.0)',
    inactiveTintColor: 'rgba(149, 165, 166, 1.0)',
    labelStyle: {
      fontSize: 13,
    },
  },
};

export const TabBar = TabNavigator(routeConfiguration, tabBarConfiguration);

export const tabBarReducer = (state, action) => {
  if (action.type === 'JUMP_TO_TAB') {
    return { ...state, index: 0 };
  }

  return TabBar.router.getStateForAction(action, state);
};
