import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  VirtualizedList,
} from 'react-native';
import { connect } from 'react-redux';

import { cards } from '../../../lib/Destiny';


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(236, 240, 241, 1.0)',
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
    padding: 12,
  },
  badRow: {
    opacity: 0.8,
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
  deck: {
    backgroundColor: 'rgba(52, 73, 94, 1.0)',
    padding: 12,
    width: '100%',
  },
  deckText: {
    color: 'white',
  },
});

class CharactersView extends Component {
  static navigationOptions = {
    title: 'Characters',
  }

  constructor(props) {
    super(props);

    this.state = {
      characterCards: this.props.charactersState.get('cards').toList(),
      deckCards: this.props.deckState.get('cards'),
    };

    this.renderItem = this.renderItem.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const newState = {};

    if (this.state.characterCards !== nextProps.charactersState.get('cards').toList()) {
      newState.characterCards = nextProps.charactersState.get('cards').toList();
    }

    if (this.state.deckCards !== nextProps.deckState.get('cards')) {
      newState.deckCards = nextProps.deckState.get('cards');
    }

    this.setState(newState);
  }

  renderItem({ item }) {
    const { navigate } = this.props.navigation;
    const card = cards.get(item.get('id'));
    const rowStyle = [styles.row];

    if (!item.get('isCompatibile')) {
      rowStyle.push(styles.badRow);
    }

    switch (card.faction) {
      case 'blue':
        rowStyle.push(styles.blueCard);
        break;
      case 'red':
        rowStyle.push(styles.redCard);
        break;
      case 'yellow':
        rowStyle.push(styles.yellowCard);
        break;
    }

    return (
      <TouchableHighlight
        onPress={ () => navigate('CharactersDetailsScreen', { id: item.get('id') }) }
      >
        <Text style={ rowStyle }>
          { item.get('name') }
        </Text>
      </TouchableHighlight>
    );
  }

  render() {
    const { deckState } = this.props;

    const deckView = deckState.get('points') > 0 ? (
      <View style={ styles.deck }>
        <Text style={ styles.deckText }>Points: { deckState.get('points') }</Text>
        <Text style={ styles.deckText }>Characters: { deckState.get('cards').map(character => (character.get('isElite') ? 'e' : '') + character.get('name') + (character.get('count') > 1 ? ' x' + character.get('count') : '')).join(', ') }</Text>
      </View>
    ) : (
      <View style={ styles.deck }>
        <Text style={ styles.deckText }>{ 'No Characters Selected' }</Text>
      </View>
    );

    return (
      <View style={ styles.container }>
        <VirtualizedList
          style={ styles.list }
          data={ this.state.characterCards }
          renderItem={ this.renderItem }
          getItem={ (data, key) => (data.get ? data.get(key) : data[key]) }
          getItemCount={ data => (data.size || data.length || 0) }
          keyExtractor={ (item, index) => String(index) }
        />
        { deckView }
      </View>
    );
  }
}

const mapStateToProps = state => ({
  charactersState: state.charactersReducer,
  deckState: state.deckReducer,
});

export default connect(mapStateToProps)(CharactersView);
