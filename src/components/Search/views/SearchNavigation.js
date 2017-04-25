import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';

import { SearchNavigator } from '../navigationConfiguration';


class SearchNavigation extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Characters',
  }

  render() {
    const { navigationState, dispatch } = this.props;
    return (
      <SearchNavigator
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

const mapStateToProps = state => ({ navigationState: state.searchTab });

export default connect(mapStateToProps)(SearchNavigation);
