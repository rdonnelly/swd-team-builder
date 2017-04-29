import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import { addCharacter, removeCharacter } from '../../../actions';
import { cards } from '../../../lib/Destiny';


class CharactersDetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'Character Details',
  }

  render() {
    const cardId = this.props.navigation.state.params.id;
    const card = cards.get(cardId);

    const { deckState } = this.props;

    const regularButton =
      <TouchableOpacity
        onPress={ () => this.props.addCharacter(card, false) }
        style={{
          padding: 20,
          borderRadius: 20,
          backgroundColor: 'purple',
          marginTop: 20,
        }}>
        <Text>{ `Add Regular Character (${card.get('pointsRegular')})` }</Text>
      </TouchableOpacity>;

    const eliteButton = card.get('pointsElite') ?
      <TouchableOpacity
        onPress={ () => this.props.addCharacter(card, true) }
        style={{
          padding: 20,
          borderRadius: 20,
          backgroundColor: 'purple',
          marginTop: 20,
        }}>
        <Text>{ `Add Elite Character (${card.get('pointsElite')})` }</Text>
      </TouchableOpacity> : null;

    // TODO only show if in deck
    const removeButton = deckState.get('cards').some(deckCard => deckCard.get('id') === card.get('id')) ?
      <TouchableOpacity
        onPress={ () => this.props.removeCharacter(card) }
        style={{
          padding: 20,
          borderRadius: 20,
          backgroundColor: 'purple',
          marginTop: 20,
        }}>
        <Text>{ 'Remove Character' }</Text>
      </TouchableOpacity> : null;


    return (
      <View style={{
        flex: 1,
        backgroundColor: 'orange',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text>{ card.get('name') }</Text>
        { regularButton }
        { eliteButton }
        { removeButton }
      </View>
    );
  }
}

const mapStateToProps = state => ({ deckState: state.deckReducer });

const mapDispatchToProps = { addCharacter, removeCharacter };

export default connect(mapStateToProps, mapDispatchToProps)(CharactersDetailsScreen);
