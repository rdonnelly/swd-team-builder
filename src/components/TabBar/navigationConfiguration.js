import { TabNavigator } from 'react-navigation';

import SearchNavigation from '../Search/views/SearchNavigation';
import ResultsNavigation from '../Results/views/ResultsNavigation';


const routeConfiguration = {
  SearchNavigation: { screen: SearchNavigation },
  ResultsNavigation: { screen: ResultsNavigation },
};

const tabBarConfiguration = {
  // ...other configs
  tabBarOptions: {
    // tint color is passed to text and icons (if enabled) on the tab bar
    // activeTintColor: 'white',
    // inactiveTintColor: 'blue',
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
