import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ImmutableListView from 'react-native-immutable-list-view';

import { cards } from '../../../lib/Destiny';

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
  },
});

export default class SearchView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      characterCards: cards.filter(card => card.get('type_code') === 'character'),
    };
  }

  renderRow(rowData) {
    return (
      <Text style={styles.row}>
        {rowData.get('name')}
      </Text>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ImmutableListView
          style={styles.list}
          immutableData={this.state.characterCards}
          renderRow={this.renderRow}
        />
      </View>
    );
  }
}
