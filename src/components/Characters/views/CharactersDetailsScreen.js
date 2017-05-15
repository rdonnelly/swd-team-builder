import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import { cards } from '../../../lib/Destiny';
import { cardImages } from '../../../lib/DestinyImages';

import { addCharacter, removeCharacter } from '../../../actions';
import SWDIcon from '../../SWDIcon/SWDIcon';


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
          width: '38%',
          marginRight: '2%',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <SWDIcon type={ 'DIE' } font={ 'swdestiny' } style={{ fontSize: 16, color: 'white', textAlign: 'center' }} />
      </TouchableOpacity>;

    const eliteButton = card.get('pointsElite') ?
      <TouchableOpacity
        onPress={ () => this.props.addCharacter(card, true) }
        style={{
          padding: 20,
          borderRadius: 4,
          backgroundColor: 'rgba(46, 204, 113, 1.0)',
          width: '38%',
          marginLeft: '2%',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <View>
          <SWDIcon type={ 'DIE' } font={ 'swdestiny' } style={{ fontSize: 16, color: 'white', textAlign: 'center' }} />
        </View>
        <View style={{ marginLeft: 8 }}>
          <SWDIcon type={ 'DIE' } font={ 'swdestiny' } style={{ fontSize: 16, color: 'white', textAlign: 'center' }} />
        </View>
      </TouchableOpacity> : null;

    const removeButton = deckState.get('cards').some(deckCard => deckCard.get('id') === card.get('id')) ?
      <TouchableOpacity
        onPress={ () => this.props.removeCharacter(card) }
        style={{
          padding: 20,
          borderRadius: 4,
          backgroundColor: 'rgba(230, 126, 34, 1.0)',
          width: '80%',
        }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>{ 'Remove' }</Text>
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
          <View style={{ flex: 1, paddingTop: 16, width: '100%', height: 340 }}>
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
          <View style={{ marginTop: 16, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', flex: 1, width: '100%' }}>
            { regularButton }
            { eliteButton }
          </View>
          <View style={{ marginTop: 16, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', flex: 1, width: '100%' }}>
            { removeButton }
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({ deckState: state.deckReducer });

const mapDispatchToProps = { addCharacter, removeCharacter };

export default connect(mapStateToProps, mapDispatchToProps)(CharactersDetailsScreen);
