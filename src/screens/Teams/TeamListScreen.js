import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActionSheetIOS,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';

import TeamListItem from '../../components/TeamListItem';

import { updateSort } from '../../store/actions';
import { getAvailableTeams } from '../../store/selectors/teamSelectors';

import { base, colors } from '../../styles';


const styles = StyleSheet.create({
  headerIconContainer: {
    ...base.headerIconContainer,
  },
  headerIcon: {
    ...base.headerIcon,
  },
  container: {
    ...base.container,
    backgroundColor: colors.lightGray,
  },
  list: {
    backgroundColor: colors.lightGrayTranslucent,
    flex: 1,
    width: '100%',
  },
  messageContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '80%',
  },
  messageHeader: {
    color: colors.gray,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  messageText: {
    color: colors.gray,
    textAlign: 'center',
  },
});

class TeamListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      headerTitle: 'Teams',
      headerRight: (
        <TouchableOpacity
          onPress={ () => { state.params.showSortActionSheet(); } }
          style={ styles.headerIconContainer }
        >
          <FontAwesome5Icon
            name={ 'sort-amount-down' }
            size={ 18 }
            style={ styles.headerIcon }
          />
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);

    if (props.navigation) {
      props.navigation.setParams({
        resetScreen: this.resetScreen,
        showSortActionSheet: this.showSortActionSheet,
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.teams !== nextProps.teams) {
      return true;
    }

    return false;
  }

  resetScreen = () => {
    if (this.listView) {
      this.listView.scrollToOffset(0);
    }
  }

  showSortActionSheet = () => {
    const options = [
      'Sort by # of Dice',
      'Sort by Health',
      'Sort by Points',
      'Cancel',
    ];

    ActionSheetIOS.showActionSheetWithOptions({
      options,
      title: 'Sort Teams',
      message: 'Sort the list of teams by one of the following stats in descending order',
      cancelButtonIndex: 3,
      tintColor: colors.brand,
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

  renderItem = ({ item: teamObject }) => (
    <TeamListItem
      teamObject={ teamObject }
    />
  )

  render() {
    const list = this.props.teams.length ? (
      <FlatList
        ref={ (component) => { this.listView = component; } }
        style={ styles.list }
        data={ this.props.teams }
        extraData={ this.state }
        renderItem={ this.renderItem }
        keyExtractor={ item => item.key }
        showsVerticalScrollIndicator={ false }
        initialNumToRender={ 9 }
        maxToRenderPerBatch={ 9 }
        updateCellsBatchingPeriod={ 100 }
        windowSize={ 35 }
      />
    ) : (
      <View style={ styles.messageContainer }>
        <Text style={ styles.messageHeader }>
          No Teams Compatible
        </Text>
        <Text style={ styles.messageText}>
          Try changing your selected characters or adjusting your settings.
        </Text>
      </View>
    );

    return (
      <View style={ styles.container }>
        { list }
      </View>
    );
  }
}

const mapStateToProps = state => ({
  teams: getAvailableTeams(state),
});

const mapDispatchToProps = {
  updateSort,
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamListScreen);

TeamListScreen.propTypes = {
  navigation: PropTypes.object.isRequired,

  teams: PropTypes.array.isRequired,

  updateSort: PropTypes.func.isRequired,
};
