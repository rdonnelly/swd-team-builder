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
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    width: '100%',
  },
});


class CharactersDetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'Character Details',
  }

  render() {
    const cardId = this.props.navigation.state.params.id;
    const card = cards.get(cardId);

    const { deckState } = this.props;

    const characterIsInDeck = deckState.get('cards').some(deckCard => deckCard.get('id') === card.get('id'));

    const addButton = !characterIsInDeck ?
      <TouchableOpacity
        onPress={ () => this.props.addCharacter(card) }
        style={{
          backgroundColor: 'rgba(46, 204, 113, 1.0)',
          borderRadius: 4,
          flex: 1,
          padding: 16,
        }}>
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', textAlign: 'center' }}>{ 'Add Character' }</Text>
      </TouchableOpacity> : null;

    const removeButton = characterIsInDeck ?
      <TouchableOpacity
        onPress={ () => this.props.removeCharacter(card) }
        style={{
          backgroundColor: 'rgba(230, 126, 34, 1.0)',
          borderRadius: 4,
          flex: 1,
          padding: 16,
        }}>
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', textAlign: 'center' }}>{ 'Remove Character' }</Text>
      </TouchableOpacity> : null;

    const anyButton = characterIsInDeck && card.get('isUnique') ?
      <TouchableOpacity
        onPress={ () => this.props.setCharacterAny(card) }
        style={{
          alignItems: 'center',
          backgroundColor: 'rgba(155, 89, 182, 1.0)',
          borderRadius: 4,
          flex: 1,
          flexDirection: 'row',
          height: 42,
          justifyContent: 'center',
          marginRight: 4,
        }}>
        <Text style={{ color: 'white', fontSize: 14, fontWeight: '600', textAlign: 'center' }}>{ 'Any' }</Text>
      </TouchableOpacity> : null;

    const regularButton = characterIsInDeck && card.get('isUnique') ?
      <TouchableOpacity
        onPress={ () => this.props.setCharacterRegular(card) }
        style={{
          alignItems: 'center',
          backgroundColor: 'rgba(155, 89, 182, 1.0)',
          borderRadius: 4,
          flex: 1,
          flexDirection: 'row',
          height: 42,
          justifyContent: 'center',
          marginHorizontal: 4,
        }}>
        <SWDIcon type={ 'DIE' } font={ 'swdestiny' } style={{ fontSize: 16, color: 'white', textAlign: 'center' }} />
      </TouchableOpacity> : null;

    const eliteButton = characterIsInDeck && card.get('isUnique') && card.get('pointsElite') ?
      <TouchableOpacity
        onPress={ () => this.props.setCharacterElite(card) }
        style={{
          alignItems: 'center',
          backgroundColor: 'rgba(155, 89, 182, 1.0)',
          borderRadius: 4,
          flex: 1,
          flexDirection: 'row',
          height: 42,
          justifyContent: 'center',
          marginLeft: 4,
        }}>
        <View>
          <SWDIcon type={ 'DIE' } font={ 'swdestiny' } style={{ fontSize: 16, color: 'white', textAlign: 'center' }} />
        </View>
        <View style={{ marginLeft: 8 }}>
          <SWDIcon type={ 'DIE' } font={ 'swdestiny' } style={{ fontSize: 16, color: 'white', textAlign: 'center' }} />
        </View>
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
          paddingHorizontal: 16,
        }}>
          <View style={{ flex: 1, paddingTop: 16, width: '100%', height: 300 }}>
            <Image
              style={{
                flex: 1,
                width: '100%',
              }}
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
            { removeButton }
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({ deckState: state.deckReducer });

const mapDispatchToProps = {
  addCharacter,
  setCharacterAny,
  setCharacterRegular,
  setCharacterElite,
  removeCharacter,
};

export default connect(mapStateToProps, mapDispatchToProps)(CharactersDetailsScreen);
