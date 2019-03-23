import React, { Component } from 'react';
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

import { validateCode } from '../../lib/SWDIconCodes';
import SWDIcon from '../../components/SWDIcon';

import {
  addCharacter,
  setCharacterAny,
  setCharacterRegular,
  setCharacterElite,
  removeCharacter,
  includeCharacter,
  excludeCharacter,
} from '../../store/actions';
import { getCharacters } from '../../store/selectors/characterSelectors';
import { getDeckCharacters } from '../../store/selectors/deckSelectors';

import { cardBack, cardImages } from '../../lib/DestinyImages';

import { base as baseStyles, colors } from '../../styles';


const styles = StyleSheet.create({
  container: {
    ...baseStyles.container,
    backgroundColor: colors.lightGray,
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
  detailsImage: {
    flex: 1,
  },
  actionBar: {
    backgroundColor: colors.darkGrayTranslucent95,
    paddingBottom: 8,
    paddingHorizontal: 8,
    paddingTop: 16,
    width: '100%',
  },
  message: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  buttonView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  button: {
    ...baseStyles.button,
    backgroundColor: colors.darkGrayDark,
    flex: 1,
    marginBottom: 8,
  },
  buttonDisabled: {
    backgroundColor: colors.darkGrayDark,
  },
  buttonGreen: {
    backgroundColor: colors.green,
  },
  buttonOrange: {
    backgroundColor: colors.orange,
  },
  buttonPurple: {
    backgroundColor: colors.purple,
  },
  buttonLeft: {
    marginRight: 4,
  },
  buttonMiddle: {
    marginHorizontal: 4,
  },
  buttonRight: {
    marginLeft: 4,
  },
  buttonIcon: {
    ...baseStyles.buttonText,
    fontSize: 18,
    marginHorizontal: 4,
  },
  buttonText: {
    ...baseStyles.buttonText,
  },
  buttonTextHighlight: {
    fontStyle: 'italic',
    fontWeight: '700',
  },
  buttonTextIcon: {
    fontSize: 14,
  },
});


class CharacterDetailScreen extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.characters !== nextProps.characters ||
        this.props.deckCharacters !== nextProps.deckCharacters) {
      return true;
    }

    return false;
  }

  render() {
    const {
      characters,
      deckCharacters,
    } = this.props;

    const cardId = this.props.navigation.getParam('id');
    const characterObject = characters.find(character => character.id === cardId);
    const deckCharacterObject =
      deckCharacters.find(deckCharacter => deckCharacter.id === characterObject.id);
    const characterIsInDeck = !!deckCharacterObject;
    const characterIsIncompatible = characterObject.isIncompatible;
    const characterIsExcluded = characterObject.isExcluded;

    const setIcon = validateCode(characterObject.set) ? (
      <SWDIcon type={ characterObject.set } style={ styles.buttonTextIcon } />
    ) : null;

    let deckMessageText = '';
    if (characterIsInDeck) {
      deckMessageText = 'Character Selected for Team';

      if (!characterObject.isUnique && deckCharacterObject.count > 1) {
        deckMessageText += ` (x${deckCharacterObject.count})`;
      }
    }

    const deckMessage = deckMessageText ?
      <View style={ styles.buttonView }>
        <Text style={ styles.message }>
          { deckMessageText }
        </Text>
      </View> : null;

    let incompatibleMessageText = '';
    if (characterIsIncompatible) {
      incompatibleMessageText = 'Character Incompatible with Selected Characters or Settings';
    }

    const incompatibleMessage = incompatibleMessageText ?
      <View style={ styles.buttonView }>
        <Text style={ styles.message }>
          { incompatibleMessageText }
        </Text>
      </View> : null;

    const excludeButton =
      !characterIsExcluded && !characterIsInDeck && !characterIsIncompatible ? (
        <TouchableOpacity
          onPress={ () => this.props.excludeCharacter(characterObject.id) }
          style={ [styles.button, styles.buttonOrange] }
        >
          <Text style={ styles.buttonText }>
            { 'Exclude ' }
            <Text style={ styles.buttonTextHighlight }>
              { characterObject.name }
              &nbsp;{ setIcon }
            </Text>
          </Text>
        </TouchableOpacity>
      ) : null;

    const includeButton =
      characterIsExcluded && !characterIsInDeck && !characterIsIncompatible ? (
        <TouchableOpacity
          onPress={ () => this.props.includeCharacter(characterObject.id) }
          style={ [styles.button, styles.buttonOrange] }
        >
          <Text style={ styles.buttonText }>
            { 'Include ' }
            <Text style={ styles.buttonTextHighlight }>
              { characterObject.name }
              &nbsp;{ setIcon }
            </Text>
          </Text>
        </TouchableOpacity>
      ) : null;

    const addButton =
      (!characterIsInDeck || !characterObject.isUnique) &&
      !characterIsIncompatible && !characterIsExcluded ? (
          <TouchableOpacity
            onPress={ () => this.props.addCharacter(characterObject) }
            style={ [styles.button, styles.buttonGreen] }
          >
            <Text style={ styles.buttonText }>
              { !characterIsInDeck || characterObject.isUnique ?
                'Add ' :
                'Add Another ' }
              <Text style={ styles.buttonTextHighlight }>
                { characterObject.name }
                &nbsp;{ setIcon }
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
            { characterObject.name }
            &nbsp;{ setIcon }
          </Text>
        </Text>
      </TouchableOpacity> : null;

    const anyButton = characterIsInDeck && characterObject.isUnique ?
      <TouchableOpacity
        disabled={ deckCharacterObject.diceCount === 0 }
        onPress={ () => this.props.setCharacterAny(characterObject) }
        style={ [
          styles.button,
          styles.buttonPurple,
          styles.buttonLeft,
          deckCharacterObject.diceCount === 0 && styles.buttonDisabled,
        ] }
      >
        <Text style={ styles.buttonText }>{ 'Any' }</Text>
      </TouchableOpacity> : null;

    const regularButton = characterIsInDeck && characterObject.isUnique ?
      <TouchableOpacity
        disabled={ deckCharacterObject.diceCount === 1 }
        onPress={ () => this.props.setCharacterRegular(characterObject) }
        style={ [
          styles.button,
          styles.buttonPurple,
          styles.buttonMiddle,
          deckCharacterObject.diceCount === 1 && styles.buttonDisabled,
        ] }
      >
        <SWDIcon type={ 'DIE' } style={ styles.buttonIcon } />
      </TouchableOpacity> : null;

    const eliteButton =
      characterIsInDeck && characterObject.isUnique && characterObject.pointsElite ?
      <TouchableOpacity
        disabled={ deckCharacterObject.diceCount === 2 }
        onPress={ () => this.props.setCharacterElite(characterObject) }
        style={ [
          styles.button,
          styles.buttonPurple,
          styles.buttonRight,
          deckCharacterObject.diceCount === 2 && styles.buttonDisabled,
        ] }
      >
        <View>
          <SWDIcon type={ 'DIE' } style={ styles.buttonIcon } />
        </View>
        <View>
          <SWDIcon type={ 'DIE' } style={ styles.buttonIcon } />
        </View>
      </TouchableOpacity> : null;

    const imageSrc = cardImages[characterObject.id] || cardBack;

    return (
      <View style={ styles.container }>
        <ScrollView style={ styles.details }>
          <View style={ styles.detailsImageContainer }>
            <Image
              style={styles.detailsImage }
              resizeMode='contain'
              source={ imageSrc }
            />
          </View>
        </ScrollView>
        <View style={ styles.actionBar }>
          { incompatibleMessage }
          { deckMessage }
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
          <View style={ styles.buttonView }>
            { excludeButton }
          </View>
          <View style={ styles.buttonView }>
            { includeButton }
          </View>
        </View>
      </View>
    );
  }
}

CharacterDetailScreen.propTypes = {
  navigation: PropTypes.object.isRequired,

  characters: PropTypes.array.isRequired,
  deckCharacters: PropTypes.array.isRequired,

  addCharacter: PropTypes.func.isRequired,
  setCharacterAny: PropTypes.func.isRequired,
  setCharacterElite: PropTypes.func.isRequired,
  setCharacterRegular: PropTypes.func.isRequired,
  removeCharacter: PropTypes.func.isRequired,

  includeCharacter: PropTypes.func.isRequired,
  excludeCharacter: PropTypes.func.isRequired,
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
  includeCharacter,
  excludeCharacter,
};

export default connect(mapStateToProps, mapDispatchToProps)(CharacterDetailScreen);
