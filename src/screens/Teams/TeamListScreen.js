import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActionSheetIOS, FlatList, StyleSheet, Text, View } from 'react-native';

import TeamListItem from '../../components/TeamListItem';

import withData from '../../components/withData';

import { base, colors } from '../../styles';

const styles = StyleSheet.create({
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
    if (this.props.data !== nextProps.data) {
      return true;
    }

    return false;
  }

  resetScreen = () => {
    if (this.listView) {
      this.listView.scrollToOffset(0);
    }
  };

  showSortActionSheet = () => {
    const { updateSortPriority } = this.props;

    const options = [
      'Sort by # of Dice',
      'Sort by Health',
      'Sort by Points',
      'Cancel',
    ];

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        title: 'Sort Teams',
        message:
          'Sort the list of teams by one of the following stats in descending order',
        cancelButtonIndex: 3,
        tintColor: colors.brand,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0: // dice
            updateSortPriority('diceCount');
            break;
          case 1: // health
            updateSortPriority('health');
            break;
          case 2: // points
            updateSortPriority('points');
            break;
          default:
            break;
        }
      },
    );
  };

  renderItem({ item: teamObject }) {
    return <TeamListItem teamObject={teamObject} />;
  }

  render() {
    const { data: teams, dataIsLoading } = this.props;
    const hasTeams = teams && teams.length;
    let content = null;

    if (dataIsLoading) {
      content = (
        <View style={styles.messageContainer}>
          <Text style={styles.messageHeader}>Loading...</Text>
        </View>
      );
    } else if (!hasTeams) {
      content = (
        <View style={styles.messageContainer}>
          <Text style={styles.messageHeader}>No Teams Compatible</Text>
          <Text style={styles.messageText}>
            Try changing your selected characters or adjusting your settings.
          </Text>
        </View>
      );
    } else {
      content = (
        <FlatList
          ref={(component) => {
            this.listView = component;
          }}
          style={styles.list}
          data={teams}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          maxToRenderPerBatch={6}
          updateCellsBatchingPeriod={100}
          windowSize={24}
        />
      );
    }

    return <View style={styles.container}>{content}</View>;
  }
}

export default withData()(
  TeamListScreen,
  (dataSource) => dataSource.getTeams(),
  {
    updateSortPriority: (dataSource, priority) =>
      dataSource.updateSortPriority(priority),
  },
);

TeamListScreen.propTypes = {
  navigation: PropTypes.object.isRequired,

  data: PropTypes.array,
  dataIsLoading: PropTypes.bool.isRequired,
  updateSortPriority: PropTypes.func.isRequired,
};
