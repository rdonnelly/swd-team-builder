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

import SelectedCharacters from '../../SelectedCharacters';
import SWDIcon from '../../SWDIcon/SWDIcon';


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
    borderColor: 'rgba(189, 195, 199, 1.0)',
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
});


class CharactersView extends Component {
  static navigationOptions = {
    title: 'Characters',
  };

  constructor(props) {
    super(props);

    this.state = {
      characterCards: this.props.charactersState.get('cards').toList(),
    };

    this.renderItem = this.renderItem.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const newState = {};

    if (this.state.characterCards !== nextProps.charactersState.get('cards').toList()) {
      newState.characterCards = nextProps.charactersState.get('cards').toList();
    }

    this.setState(newState);
  }

  renderItem({ item }) {
    const { navigate } = this.props.navigation;
    const card = cards.get(item.get('id'));
    const rowStyle = [styles.row];
    const cardLogoStyle = [styles.cardLogo];
    const cardNameStyle = [styles.cardName];

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
      <Text style={ styles.cardInfo }>&nbsp;{ card.subtitle }&nbsp;&middot;</Text>
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
      <TouchableHighlight
        activeOpacity={ 0.6 }
        underlayColor={ 'rgba(236, 240, 241, 1.0)' }
        onPress={ () => navigate('CharactersDetailsScreen', { id: item.get('id') }) }
      >
        <View style={ rowStyle }>
          <View style={{ justifyContent: 'center', paddingRight: 10 }}>
            <SWDIcon type={ 'CHARACTER' } font={ 'swdestiny' } style={ cardLogoStyle } />
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={ cardNameStyle }>{ card.name }</Text>
              <Text style={ cardNameStyle }>&nbsp;</Text>
              <Text style={ cardNameStyle }>{ uniqueIcon }</Text>
            </View>
            { cardInfo }
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
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
        <SelectedCharacters></SelectedCharacters>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  charactersState: state.charactersReducer,
});

export default connect(mapStateToProps)(CharactersView);
