/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import ImmutableListView from 'react-native-immutable-list-view';

import { CardSets } from './src/lib/Destiny';

export default class DestinyCharacters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardSets: new CardSets(),
    };

    console.log(this.state.cardSets.sets.toObject());

    // const awCharacters = Immutable.fromJS(awakeningsCards)
    //   .filter(card => card.get('type_code') === 'character');
    //
    // const sorCharacters = Immutable.fromJS(spiritOfRebellionCards)
    //   .filter(card => card.get('type_code') === 'character');
    //
    // this.state = {
    //   aw: awCharacters,
    //   sor: sorCharacters,
    // };
  }

  renderRow(rowData) {
    return <Text>{rowData.get('name')}</Text>;
  }

  render() {
    return (
      <View style={styles.container}>
        <ImmutableListView
          immutableData={this.state.cardSets.sets.get('aw').get('cards').filter(card => card.get('type_code') === 'character')}
          renderRow={this.renderRow}
        />

        <ImmutableListView
          immutableData={this.state.cardSets.sets.get('sor').get('cards').filter(card => card.get('type_code') === 'character')}
          renderRow={this.renderRow}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
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

AppRegistry.registerComponent('DestinyCharacters', () => DestinyCharacters);
