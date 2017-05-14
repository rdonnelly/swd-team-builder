import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  VirtualizedList,
  Button,
} from 'react-native';
import { connect } from 'react-redux';

import SWDIcon from '../../SWDIcon/SWDIcon';
import { reset } from '../../../actions';
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  badRow: {
    opacity: 0.8,
  },
  cardLogo: {
    fontSize: 18,
  },
  cardName: {
    fontSize: 20,
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
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      title: 'Characters',
      headerRight: (
        <Button
          title={ 'Reset' }
          onPress={ () => { state.params.resetDeck(); } }
        />
      ),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      characterCards: this.props.charactersState.get('cards').toList(),
      deckCards: this.props.deckState.get('cards'),
    };

    this.renderItem = this.renderItem.bind(this);
    this.resetDeck = this.resetDeck.bind(this);
  }

  componentWillMount() {
    this.props.navigation.setParams({
      resetDeck: this.resetDeck.bind(this),
    });
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

  resetDeck() {
    this.props.reset();
  }

  renderItem({ item }) {
    const { navigate } = this.props.navigation;
    const card = cards.get(item.get('id'));
    const rowStyle = [styles.row];
    const cardLogoStyle = [styles.cardLogo];
    const cardNameStyle = [styles.cardName];

    if (!item.get('isCompatibile')) {
      rowStyle.push(styles.badRow);
    }

    switch (card.faction) {
      case 'blue':
        cardLogoStyle.push(styles.blueCard);
        cardNameStyle.push(styles.blueCard);
        break;
      case 'red':
        cardLogoStyle.push(styles.redCard);
        cardNameStyle.push(styles.redCard);
        break;
      case 'yellow':
        cardLogoStyle.push(styles.yellowCard);
        cardNameStyle.push(styles.yellowCard);
        break;
    }

    return (
      <TouchableHighlight
        onPress={ () => navigate('CharactersDetailsScreen', { id: item.get('id') }) }
      >
        <View style={ rowStyle }>
          <View style={{ justifyContent: 'center', paddingLeft: 10, paddingRight: 10 }}>
            <SWDIcon type={ 'CHARACTER' } font={ 'swdestiny' } style={ cardLogoStyle } />
          </View>
          <View>
            <Text style={ cardNameStyle }>{ item.get('name') }</Text>
          </View>
        </View>
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

const mapDispatchToProps = { reset };

export default connect(mapStateToProps, mapDispatchToProps)(CharactersView);
