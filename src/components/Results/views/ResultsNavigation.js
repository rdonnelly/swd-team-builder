import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';

import { ResultsNavigator } from '../navigationConfiguration';


class ResultsNavigation extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Results',
  }

  render() {
    const { navigationState, dispatch } = this.props;
    return (
      <ResultsNavigator
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

const mapStateToProps = state => ({ navigationState: state.resultsTab });

export default connect(mapStateToProps)(ResultsNavigation);
