import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import ImmutableVirtualListView from 'react-native-immutable-list-view';

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
    padding: 10,
  },
});

export default class SearchView extends Component {
  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);

    this.state = {
      characterCards: cards.filter(card => card.get('type') === 'character'),
    };
  }

  renderRow(rowData) {
    const { navigate } = this.props.navigation;

    return (
      <TouchableHighlight
        onPress={ () => navigate('SearchDetailsScreen', { id: rowData.get('id') }) }
      >
        <Text style={styles.row}>
          { rowData.get('name') }
        </Text>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ImmutableVirtualListView
          style={styles.list}
          immutableData={this.state.characterCards}
          renderRow={this.renderRow}
        />
      </View>
    );
  }
}
