import React, { Component } from 'react';
import { TabNavigator, addNavigationHelpers } from 'react-navigation';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CharacterNavigation from '../screens/Characters/views/CharacterNavigation';
import TeamNavigation from '../screens/Teams/views/TeamNavigation';
import SettingsNavigation from '../screens/Settings/views/SettingsNavigation';

import { colors } from '../styles';


const TabBar = TabNavigator(
  {
    Characters: { screen: CharacterNavigation },
    Teams: { screen: TeamNavigation },
    Settings: { screen: SettingsNavigation },
  },
  {
    backBehavior: 'none',
    tabBarOptions: {
      activeTintColor: colors.tabActiveTint,
      inactiveTintColor: colors.tabInactiveTint,
      labelStyle: {
        fontSize: 13,
      },
    },
  },
);

class TabBarComponent extends Component {
  render() {
    const { dispatch, tabNavigation } = this.props;
    const addListener = createReduxBoundAddListener('tabNavigation');

    return (
      <TabBar
        navigation={
          addNavigationHelpers({
            dispatch,
            state: tabNavigation,
            addListener,
          })
        }
      />
    );
  }
}

TabBarComponent.propTypes = {
  dispatch: PropTypes.func.isRequired,
  tabNavigation: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({ tabNavigation: state.tabNavigation });

export const TabBarNavigation = connect(mapStateToProps)(TabBarComponent);

export const tabBarReducer = (state, action) => {
  if (action.type === 'JUMP_TO_TAB') {
    return { ...state, index: 0 };
  }

  return TabBar.router.getStateForAction(action, state);
};
