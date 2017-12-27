import React, { Component } from 'react';
import { TabNavigator, addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CharacterNavigation from '../screens/Characters/views/CharacterNavigation';
import TeamNavigation from '../screens/Teams/views/TeamNavigation';
import SettingsNavigation from '../screens/Settings/views/SettingsNavigation';

const TabBar = TabNavigator(
  {
    Characters: { screen: CharacterNavigation },
    Teams: { screen: TeamNavigation },
    Settings: { screen: SettingsNavigation },
  },
  {
    backBehavior: 'none',
    lazy: true,
    tabBarOptions: {
      activeTintColor: 'rgba(155, 89, 182, 1.0)',
      inactiveTintColor: 'rgba(149, 165, 166, 1.0)',
      labelStyle: {
        fontSize: 13,
      },
    },
  },
);

class TabBarComponent extends Component {
  render() {
    const { dispatch, navigationState } = this.props;
    return (
      <TabBar
        navigation={
          addNavigationHelpers({
            dispatch,
            state: navigationState,
          })
        }
      />
    );
  }
}

TabBarComponent.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigationState: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({ navigationState: state.tabNavigation });

export const TabBarNavigation = connect(mapStateToProps)(TabBarComponent);

export const tabBarReducer = (state, action) => {
  if (action.type === 'JUMP_TO_TAB') {
    return { ...state, index: 0 };
  }

  return TabBar.router.getStateForAction(action, state);
};
