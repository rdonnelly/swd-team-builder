import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { connect } from 'react-redux';
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

class CharactersView extends Component {
  static navigationOptions = {
    title: 'Characters',
  }

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
        onPress={ () => navigate('CharactersDetailsScreen', { id: rowData.get('id') }) }
      >
        <Text style={styles.row}>
          { rowData.get('name') }
        </Text>
      </TouchableHighlight>
    );
  }

  render() {
    const { deckState } = this.props;
    const deckView = (
      <View>
        <Text>Points: { deckState.get('points') }</Text>
        <Text>Characters: { deckState.get('cards').map(character => (character.get('isElite') ? 'e' : '') + character.get('name')).join(', ') }</Text>
      </View>
    );

    return (
      <View style={styles.container}>
        { deckView }
        <ImmutableVirtualListView
          style={styles.list}
          immutableData={this.state.characterCards}
          renderRow={this.renderRow}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  deckState: state.deckReducer,
});

export default connect(mapStateToProps)(CharactersView);
