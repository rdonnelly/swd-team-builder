import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import { cards } from '../../../lib/Destiny';
import { cardImages } from '../../../lib/DestinyImages';

import { addCharacter, setCharacterAny, setCharacterRegular, setCharacterElite, removeCharacter } from '../../../actions';
import SWDIcon from '../../SWDIcon/SWDIcon';

const styles = StyleSheet.create({
  buttonView: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(155, 89, 182, 0.25)',
    borderRadius: 4,
    flex: 1,
    flexDirection: 'row',
    height: 42,
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(155, 89, 182, 0.2)',
  },
  buttonGreen: {
    backgroundColor: 'rgba(46, 204, 113, 1.0)',
  },
  buttonOrange: {
    backgroundColor: 'rgba(230, 126, 34, 1.0)',
  },
  buttonPurple: {
    backgroundColor: 'rgba(155, 89, 182, 1.0)',
  },
  buttonIcon: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});


class CharactersDetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'Character Details',
  }

  render() {
    const cardId = this.props.navigation.state.params.id;

    const card = cards.get(cardId);
    const character = this.props.charactersState.get('cards')
      .find(characterCard => characterCard.get('id') === this.props.navigation.state.params.id);

    const { deckState } = this.props;

    const characterIsInDeck = deckState.get('cards').some(deckCard => deckCard.get('id') === card.get('id'));
    const deckCharacter = deckState.get('cards').find(deckCard => deckCard.get('id') === card.get('id'));

    const addButton = character.get('isCompatibile') && (!characterIsInDeck || !card.get('isUnique')) ? (
      <TouchableOpacity
        onPress={ () => this.props.addCharacter(card) }
        style={ [styles.button, styles.buttonGreen] }
      >
        <Text style={ styles.buttonText }>{ 'Add Character' }</Text>
      </TouchableOpacity>
    ) : (
      <View
        style={ [styles.button] }
      >
        <Text style={ styles.buttonText }>{ 'Character Incompatible' }</Text>
      </View>
    );

    const removeButton = characterIsInDeck ?
      <TouchableOpacity
        onPress={ () => this.props.removeCharacter(card) }
        style={ [styles.button, styles.buttonOrange] }
      >
        <Text style={ styles.buttonText }>{ 'Remove Character' }</Text>
      </TouchableOpacity> : null;

    const anyButton = characterIsInDeck && card.get('isUnique') ?
      <TouchableOpacity
        disabled={ deckCharacter.get('isElite') === null }
        onPress={ () => this.props.setCharacterAny(card) }
        style={ [styles.button, styles.buttonPurple, { marginRight: 4 }, deckCharacter.get('isElite') === null && styles.buttonDisabled] }
      >
        <Text style={ styles.buttonText }>{ 'Any' }</Text>
      </TouchableOpacity> : null;

    const regularButton = characterIsInDeck && card.get('isUnique') ?
      <TouchableOpacity
        disabled={ deckCharacter.get('isElite') === false }
        onPress={ () => this.props.setCharacterRegular(card) }
        style={ [styles.button, styles.buttonPurple, { marginHorizontal: 4 }, deckCharacter.get('isElite') === false && styles.buttonDisabled] }
      >
        <SWDIcon type={ 'DIE' } font={ 'swdestiny' } style={ styles.buttonIcon } />
      </TouchableOpacity> : null;

    const eliteButton = characterIsInDeck && card.get('isUnique') && card.get('pointsElite') ?
      <TouchableOpacity
        disabled={ deckCharacter.get('isElite') === true }
        onPress={ () => this.props.setCharacterElite(card) }
        style={ [styles.button, styles.buttonPurple, { marginLeft: 4 }, deckCharacter.get('isElite') === true && styles.buttonDisabled] }
      >
        <View>
          <SWDIcon type={ 'DIE' } font={ 'swdestiny' } style={ styles.buttonIcon } />
        </View>
        <View style={{ marginLeft: 8 }}>
          <SWDIcon type={ 'DIE' } font={ 'swdestiny' } style={ styles.buttonIcon } />
        </View>
      </TouchableOpacity> : null;

    return (
      <View style={{
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
      }}>
        <ScrollView style={{
          alignContent: 'center',
          flex: 1,
          paddingHorizontal: 16,
          width: '100%',
        }}>
          <View style={{ flex: 1, height: 300, paddingVertical: 16, alignItems: 'center' }}>
            <Image
              style={{ flex: 1 }}
              resizeMode='contain'
              source={ cardImages.get(card.get('id')) }
            />
          </View>
          <View style={ styles.buttonView }>
            { anyButton }
            { regularButton }
            { eliteButton }
          </View>
          <View style={ styles.buttonView }>
            { addButton }
          </View>
          <View style={ styles.buttonView }>
            { removeButton }
          </View>
        </ScrollView>
      </View>
    );
  }
}

CharactersDetailsScreen.propTypes = {
  navigation: React.PropTypes.object.isRequired,
  deckState: React.PropTypes.object.isRequired,

  addCharacter: React.PropTypes.func.isRequired,
  setCharacterAny: React.PropTypes.func.isRequired,
  setCharacterElite: React.PropTypes.func.isRequired,
  setCharacterRegular: React.PropTypes.func.isRequired,
  removeCharacter: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  charactersState: state.charactersReducer,
  deckState: state.deckReducer,
});

const mapDispatchToProps = {
  addCharacter,
  setCharacterAny,
  setCharacterRegular,
  setCharacterElite,
  removeCharacter,
};

export default connect(mapStateToProps, mapDispatchToProps)(CharactersDetailsScreen);
