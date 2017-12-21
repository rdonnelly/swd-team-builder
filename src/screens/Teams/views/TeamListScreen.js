import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActionSheetIOS,
  Button,
  StyleSheet,
  Text,
  View,
  VirtualizedList,
} from 'react-native';
import { connect } from 'react-redux';

import TeamListItem, { ITEM_HEIGHT } from '../../../components/TeamListItem';

import { updateSort } from '../../../actions';
import { getAvailableTeams } from '../../../selectors/teamSelectors';


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(236, 240, 241, 1.0)',
    flex: 1,
    justifyContent: 'center',
  },
  list: {
    width: '100%',
  },
  row: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(189, 195, 199, 1.0)',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  teamWrapper: {
    flex: 1,
  },
  teamCharactersWrapper: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  characterName: {
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 18,
  },
  blueCard: {
    color: 'rgba(52, 152, 219, 1.0)',
  },
  redCard: {
    color: 'rgba(231, 76, 60, 1.0)',
  },
  yellowCard: {
    color: 'rgba(241, 196, 15, 1.0)',
  },
  diceWrapper: {
    flexDirection: 'row',
    marginLeft: 4,
  },
  dice: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  teamInfoWrapper: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  teamStat: {
    color: 'rgba(149, 165, 166, 1.0)',
    fontSize: 13,
    fontWeight: '500',
    paddingRight: 8,
  },
  arrow: {
    color: 'rgba(149, 165, 166, 1.0)',
    marginTop: 2,
  },
});

class TeamListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      title: 'Teams',
      headerRight: (
        <Button
          title={ 'Sort' }
          color={ 'rgba(255, 255, 255, 1.0)' }
          onPress={ () => { state.params.showSortActionSheet(); } }
        />
      ),
      headerTintColor: 'rgba(255, 255, 255, 1.0)',
      headerStyle: {
        backgroundColor: 'rgba(155, 89, 182, 1.0)',
      },
    };
  };

  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const currentTabIndex = nextProps.tabBarState.index;
    const currentTabRouteName = nextProps.tabBarState.routes[currentTabIndex].routeName;
    if (currentTabRouteName !== 'Teams') {
      return false;
    }

    return true;
  }

  componentWillMount() {
    this.props.navigation.setParams({
      showSortActionSheet: this.showSortActionSheet.bind(this),
    });
  }

  renderItem({ item: teamObject }) {
    const { navigate } = this.props.navigation;

    return (
      <TeamListItem
        teamObject={ teamObject }
        navigate={ navigate }
      />
    );
  }

  getItemLayout(data, index) {
    return {
      offset: ITEM_HEIGHT * index,
      length: ITEM_HEIGHT,
      index,
    };
  }

  render() {
    const { teams } = this.props;

    const list = teams.count() ? (
      <VirtualizedList
        style={ styles.list }
        data={ teams }
        renderItem={ this.renderItem }
        getItem={ (data, key) => data.get(key) }
        getItemCount={ data => (data.size || data.count || 0) }
        keyExtractor={ item => `team_list__${item.get('key')}` }
        getItemLayout={ this.getItemLayout }
      />
    ) : (
      <View style={{ width: '80%' }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: 'rgba(149, 165, 166, 1.0)', fontSize: 24, fontWeight: '700', textAlign: 'center' }}>No Teams Compatible</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: 'rgba(149, 165, 166, 1.0)', textAlign: 'center' }}>
            Try changing your selected characters or adjusting your settings.
          </Text>
        </View>
      </View>
    );

    return (
      <View style={ styles.container }>
        { list }
      </View>
    );
  }

  showSortActionSheet() {
    const options = [
      'Sort By Dice',
      'Sort By Health',
      'Sort By Points',
      'Cancel',
    ];

    ActionSheetIOS.showActionSheetWithOptions({
      options,
      title: 'Sort Teams',
      message: 'Sort the list of teams by one of the following stats in descending order',
      cancelButtonIndex: 3,
      tintColor: 'rgba(155, 89, 182, 1.0)',
    },
    (buttonIndex) => {
      switch (buttonIndex) {
        case 0: // dice
          this.props.updateSort('dice');
          break;
        case 1: // health
          this.props.updateSort('health');
          break;
        case 2: // points
          this.props.updateSort('points');
          break;
        default:
          break;
      }
    });
  }
}

const mapStateToProps = state => ({
  teams: getAvailableTeams(state),
  tabBarState: state.tabBar,
});

const mapDispatchToProps = { updateSort };

export default connect(mapStateToProps, mapDispatchToProps)(TeamListScreen);

TeamListScreen.propTypes = {
  teams: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  updateSort: PropTypes.func.isRequired,
};
