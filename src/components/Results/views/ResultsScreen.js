import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

class ResultsView extends Component {
  render() {
    const { deckState } = this.props;

    return (
      <View style={styles.container}>
        <Text>Results View</Text>
        <Text>{ deckState.get('cards').toJS() }</Text>
        <Text>{ deckState.get('points') }</Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({ deckState: state.deckReducer });

export default connect(mapStateToProps)(ResultsView);
