import React from 'react';
import PropTypes from 'prop-types';
import { addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';

import { TabBar } from '../navigationConfiguration';


class TabBarNavigation extends React.Component {
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

const mapStateToProps = state => ({ navigationState: state.tabBar });

export default connect(mapStateToProps)(TabBarNavigation);

TabBarNavigation.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigationState: PropTypes.object.isRequired,
};
