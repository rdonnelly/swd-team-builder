import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';

import { TeamsNavigator } from '../navigationConfiguration';


class TeamsNavigation extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Teams',
  }

  render() {
    const { navigationState, dispatch } = this.props;
    return (
      <TeamsNavigator
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

const mapStateToProps = state => ({ navigationState: state.teamsTab });

export default connect(mapStateToProps)(TeamsNavigation);
