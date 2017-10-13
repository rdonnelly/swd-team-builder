import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import SWDIcon from '../../../components/SWDIcon';

import {
  addCharacter,
  setCharacterAny,
  setCharacterRegular,
  setCharacterElite,
  removeCharacter,
} from '../../../actions';
import { getCharacters } from '../../../selectors/characterSelectors';
import { getDeckCharacters } from '../../../selectors/deckSelectors';

import { characterCards } from '../../../lib/Destiny';
import { cardBack, cardImages } from '../../../lib/DestinyImages';


const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  details: {
    alignContent: 'center',
    paddingHorizontal: 16,
    width: '100%',
  },
  detailsImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 388,
    paddingVertical: 16,
  },
  actionBar: {
    backgroundColor: 'rgba(52, 73, 94, 1.0)',
    paddingBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    width: '100%',
  },
  message: {
    color: 'rgba(255, 255, 255, 1.0)',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  buttonView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(44, 62, 80, 1.0)',
    borderRadius: 4,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 8,
    marginBottom: 8,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(44, 62, 80, 1.0)',
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
  buttonTextHighlight: {
    fontStyle: 'italic',
  },
});


class CharacterDetailScreen extends React.Component {
  static navigationOptions = {
    title: 'Character Details',
    headerTintColor: 'rgba(255, 255, 255, 1.0)',
    headerStyle: {
      backgroundColor: 'rgba(155, 89, 182, 1.0)',
    },
  }

  render() {
    const {
      characters,
      deckCharacters,
    } = this.props;

    const cardId = this.props.navigation.state.params.id;

    const characterCard = characterCards.find(card => card.id === cardId);

    const characterObject = characters.find(characterObj => characterObj.get('id') === cardId);
    const deckCharacterObject = deckCharacters.find(deckCard => deckCard.get('id') === characterCard.id);
    const characterIsInDeck = !!deckCharacterObject;

    let messageText = '';
    if (characterIsInDeck) {
      messageText = 'Character Selected for Team';

      if (!characterCard.isUnique && deckCharacterObject.get('count') > 1) {
        messageText += ` (x${deckCharacterObject.get('count')})`;
      }
    } else if (!characterObject.get('isCompatibile')) {
      messageText = 'Character Incompatible with Team';
    }

    const message = messageText ?
      <View style={ styles.buttonView }>
        <Text style={ styles.message }>
          { messageText }
        </Text>
      </View> : null;

    const addButton = characterObject.get('isCompatibile') && (!characterIsInDeck || !characterCard.isUnique) ? (
      <TouchableOpacity
        onPress={ () => this.props.addCharacter(characterObject) }
        style={ [styles.button, styles.buttonGreen] }
      >
        <Text style={ styles.buttonText }>
          { !characterIsInDeck || characterCard.isUnique ?
            'Add ' :
            'Add Another ' }
          <Text style={ styles.buttonTextHighlight }>
            { characterCard.name }
          </Text>
        </Text>
      </TouchableOpacity>
    ) : null;

    const removeButton = characterIsInDeck ?
      <TouchableOpacity
        onPress={ () => this.props.removeCharacter(characterObject) }
        style={ [styles.button, styles.buttonOrange] }
      >
        <Text style={ styles.buttonText }>
          { 'Remove ' }
          <Text style={ styles.buttonTextHighlight }>
            { characterCard.name }
          </Text>
        </Text>
      </TouchableOpacity> : null;

    const anyButton = characterIsInDeck && characterCard.isUnique ?
      <TouchableOpacity
        disabled={ deckCharacterObject.get('isElite') === null }
        onPress={ () => this.props.setCharacterAny(characterObject) }
        style={ [styles.button, styles.buttonPurple, { marginRight: 4 }, deckCharacterObject.get('isElite') === null && styles.buttonDisabled] }
      >
        <Text style={ styles.buttonText }>{ 'Any' }</Text>
      </TouchableOpacity> : null;

    const regularButton = characterIsInDeck && characterCard.isUnique ?
      <TouchableOpacity
        disabled={ deckCharacterObject.get('isElite') === false }
        onPress={ () => this.props.setCharacterRegular(characterObject) }
        style={ [styles.button, styles.buttonPurple, { marginHorizontal: 4 }, deckCharacterObject.get('isElite') === false && styles.buttonDisabled] }
      >
        <SWDIcon type={ 'DIE' } font={ 'swdestiny' } style={ styles.buttonIcon } />
      </TouchableOpacity> : null;

    const eliteButton = characterIsInDeck && characterCard.isUnique && characterCard.pointsElite ?
      <TouchableOpacity
        disabled={ deckCharacterObject.get('isElite') === true }
        onPress={ () => this.props.setCharacterElite(characterObject) }
        style={ [styles.button, styles.buttonPurple, { marginLeft: 4 }, deckCharacterObject.get('isElite') === true && styles.buttonDisabled] }
      >
        <View>
          <SWDIcon type={ 'DIE' } font={ 'swdestiny' } style={ styles.buttonIcon } />
        </View>
        <View style={{ marginLeft: 8 }}>
          <SWDIcon type={ 'DIE' } font={ 'swdestiny' } style={ styles.buttonIcon } />
        </View>
      </TouchableOpacity> : null;

    const imageSrc = cardImages.get(characterCard.id, cardBack);

    return (
      <View style={ styles.container }>
        <ScrollView style={ styles.details }>
          <View style={ styles.detailsImageContainer }>
            <Image
              style={{ flex: 1 }}
              resizeMode='contain'
              source={ imageSrc }
            />
          </View>
        </ScrollView>
        <View style={ styles.actionBar }>
          { message }
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
        </View>
      </View>
    );
  }
}

CharacterDetailScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  characters: PropTypes.object.isRequired,
  deckCharacters: PropTypes.object.isRequired,

  addCharacter: PropTypes.func.isRequired,
  setCharacterAny: PropTypes.func.isRequired,
  setCharacterElite: PropTypes.func.isRequired,
  setCharacterRegular: PropTypes.func.isRequired,
  removeCharacter: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  characters: getCharacters(state),
  deckCharacters: getDeckCharacters(state),
});

const mapDispatchToProps = {
  addCharacter,
  setCharacterAny,
  setCharacterRegular,
  setCharacterElite,
  removeCharacter,
};

export default connect(mapStateToProps, mapDispatchToProps)(CharacterDetailScreen);
