import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import { addCharacter, removeCharacter } from '../../../actions';
import { cards, cardImages } from '../../../lib/Destiny';


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
          borderRadius: 4,
          backgroundColor: 'rgba(46, 204, 113, 1.0)',
          marginTop: 20,
          width: '80%',
          flex: 1,
          alignSelf: 'center',
        }}>
        <Text style={{ color: 'white' }}>{ `Add Regular Character (${card.get('pointsRegular')})` }</Text>
      </TouchableOpacity>;

    const eliteButton = card.get('pointsElite') ?
      <TouchableOpacity
        onPress={ () => this.props.addCharacter(card, true) }
        style={{
          padding: 20,
          borderRadius: 4,
          backgroundColor: 'rgba(46, 204, 113, 1.0)',
          marginTop: 20,
          width: '80%',
          flex: 1,
          alignSelf: 'center',
        }}>
        <Text style={{ color: 'white' }}>{ `Add Elite Character (${card.get('pointsElite')})` }</Text>
      </TouchableOpacity> : null;

    // TODO only show if in deck
    const removeButton = deckState.get('cards').some(deckCard => deckCard.get('id') === card.get('id')) ?
      <TouchableOpacity
        onPress={ () => this.props.removeCharacter(card) }
        style={{
          padding: 20,
          borderRadius: 4,
          backgroundColor: 'rgba(230, 126, 34, 1.0)',
          marginTop: 20,
          width: '80%',
          flex: 1,
          alignSelf: 'center',
        }}>
        <Text style={{ color: 'white' }}>{ 'Remove Character' }</Text>
      </TouchableOpacity> : null;


    return (
      <View style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <ScrollView style={{
          flex: 1,
          width: '100%',
          alignContent: 'center',
        }}>
          <View style={{ flex: 1, width: '100%', height: 300 }}>
            <Image
              style={{
                flex: 1,
                width: '100%',
                height: 100,
              }}
              resizeMode='contain'
              source={ cardImages.get(card.get('id')) }
            />
          </View>
          { regularButton }
          { eliteButton }
          { removeButton }
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({ deckState: state.deckReducer });

const mapDispatchToProps = { addCharacter, removeCharacter };

export default connect(mapStateToProps, mapDispatchToProps)(CharactersDetailsScreen);
