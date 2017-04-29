import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import ImmutableVirtualListView from 'react-native-immutable-list-view';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
  },
  list: {
    width: '100%',
  },
  row: {
    fontSize: 20,
    padding: 10,
  },
});

class TeamsView extends Component {
  static navigationOptions = {
    title: 'Teams',
  }

  renderRow(team) {
    return (
      <Text style={styles.row}>
        { team.get('characters').map(character => character.get('isElite') + character.get('name')).join(', ') }
      </Text>
    );
  }

  render() {
    const { deckState } = this.props;
    const { teamsState } = this.props;

    return (
      <View style={ styles.container }>
        <Text>Teams View</Text>
        <Text>- { teamsState.get('count') }</Text>
        <Text>- { deckState.get('points') }</Text>
        <ImmutableVirtualListView
          style={ styles.list}
          immutableData={ teamsState.get('teams') }
          renderRow={ this.renderRow }
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  deckState: state.deckReducer,
  teamsState: state.teamsReducer,
});

export default connect(mapStateToProps)(TeamsView);
