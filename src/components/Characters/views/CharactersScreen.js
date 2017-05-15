import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
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
    borderBottomWidth: 1,
    borderColor: 'rgba(149, 165, 166, 1.0)',
  },
  blueRow: {
    borderColor: 'rgba(52, 152, 219, 1.0)',
  },
  redRow: {
    borderColor: 'rgba(231, 76, 60, 1.0)',
  },
  yellowRow: {
    borderColor: 'rgba(241, 196, 15, 1.0)',
  },
  badRow: {
    opacity: 0.4,
  },
  cardLogo: {
    color: 'rgba(149, 165, 166, 1.0)',
    fontSize: 24,
  },
  cardName: {
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 20,
  },
  cardInfo: {
    color: 'rgba(149, 165, 166, 1.0)',
    fontSize: 13,
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
        rowStyle.push(styles.blueRow);
        cardLogoStyle.push(styles.blueCard);
        break;
      case 'red':
        rowStyle.push(styles.redRow);
        cardLogoStyle.push(styles.redCard);
        break;
      case 'yellow':
        rowStyle.push(styles.yellowRow);
        cardLogoStyle.push(styles.yellowCard);
        break;
    }

    const subtitle = card.subtitle ? (
      <Text style={ styles.cardInfo }>&nbsp;{ card.subtitle }&nbsp;&ndash;</Text>
    ) : null;

    const points = card.points ? (
      <Text style={ styles.cardInfo }>&nbsp;{ card.points.join('/') }</Text>
    ) : null;

    const cardInfo = (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <SWDIcon type={ card.set } font={ 'swdestiny' } style={{ color: 'rgba(149, 165, 166, 1.0)', fontSize: 10 }} />
        { subtitle }
        { points }
      </View>
    );

    const uniqueIcon = card.isUnique ? (
      <SWDIcon type={ 'UNIQUE' } font={ 'swdestiny' } style={{ color: 'rgba(149, 165, 166, 1.0)', fontSize: 16 }} />
    ) : null;

    return (
      <TouchableOpacity
        onPress={ () => navigate('CharactersDetailsScreen', { id: item.get('id') }) }
      >
        <View style={ rowStyle }>
          <View style={{ justifyContent: 'center', paddingLeft: 10, paddingRight: 10 }}>
            <SWDIcon type={ 'CHARACTER' } font={ 'swdestiny' } style={ cardLogoStyle } />
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={ cardNameStyle }>{ card.name }&nbsp;</Text>
              <Text style={ cardNameStyle }>{ uniqueIcon }</Text>
            </View>
            { cardInfo }
          </View>
        </View>
      </TouchableOpacity>
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
