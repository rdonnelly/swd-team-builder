import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  VirtualizedList,
} from 'react-native';
import { connect } from 'react-redux';


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
  badRow: {
    backgroundColor: 'gray',
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
    const rowStyle = [styles.row];

    if (!item.get('isCompatibile')) {
      rowStyle.push(styles.badRow);
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
    const deckView = (
      <View>
        <Text>Points: { deckState.get('points') }</Text>
        <Text>Characters: { deckState.get('cards').map(character => (character.get('isElite') ? 'e' : '') + character.get('name') + (character.get('count') > 1 ? ' x' + character.get('count') : '')).join(', ') }</Text>
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
