import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { withNavigation } from 'react-navigation';

import CharacterAvatar from './CharacterAvatar';

import { reset } from '../store/actions';
import { getDeckCharacters } from '../store/selectors/deckSelectors';

import { colors } from '../styles';


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  characterViews: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  characterView: {
    marginRight: 8,
  },
  deckInfo: {
    color: colors.lightGray,
    fontSize: 16,
    fontWeight: '600',
  },
  reset: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  resetButton: {
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 12,
  },
});


class SelectedCharacters extends Component {
  navigateToCharacterDetails = characterId => () => {
    this.props.navigation.navigate('CharacterDetailScreen', { id: characterId });
  }

  resetDeck = () => {
    if (this.props.reset) {
      this.props.reset();
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.deckCharacters !== nextProps.deckCharacters) {
      return true;
    }

    return false;
  }

  render() {
    const { deckCharacters } = this.props;

    const characterViews = deckCharacters.map(characterObject => (
      <TouchableOpacity
        key={ `selected_character__${characterObject.id}` }
        onPress={ this.navigateToCharacterDetails(characterObject.id) }
        style={ styles.characterView }
      >
        <CharacterAvatar
          cardId={ characterObject.id }
          round={ true }
          size={ 42 }
          numDice={ characterObject.numDice }
          count={ characterObject.count }
        />
      </TouchableOpacity>
    ));

    return deckCharacters.length ? (
      <View style={ styles.container }>
        <View style={ styles.characterViews }>
          { characterViews }
        </View>
        <View style={ styles.reset }>
          <TouchableOpacity
            style={ styles.resetButton }
            onPress={() => Alert.alert(
              'Clear Characters?',
              'This will reset your selections to allow you to choose different characters and look for different teams.',
              [
                { text: 'Cancel' },
                { text: 'Clear', onPress: this.resetDeck, style: 'destructive' },
              ],
            )}
          >
            <FontAwesome5Icon name={ 'trash-alt' } size={ 24 } color={ colors.lightGray } />
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      <View style={ styles.container }>
        <View style={ styles.item }>
          <Text style={ styles.deckInfo }>{ 'No Characters Selected' }</Text>
        </View>
      </View>
    );
  }
}

SelectedCharacters.propTypes = {
  navigation: PropTypes.object.isRequired,

  deckCharacters: PropTypes.array.isRequired,
  reset: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  deckCharacters: getDeckCharacters(state),
});

const mapDispatchToProps = {
  reset,
};

export default withNavigation(connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectedCharacters));
