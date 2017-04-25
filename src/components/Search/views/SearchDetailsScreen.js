import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import { addCharacter } from '../../../actions';
import { cards } from '../../../lib/Destiny';


class SearchDetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'Character Details',
  }

  render() {
    const { goBack } = this.props.navigation;
    const cardId = this.props.navigation.state.params.id;
    const card = cards.get(cardId);

    let eliteButton = null;
    if (card.get('pointsElite')) {
      eliteButton =
        <TouchableOpacity
          onPress={ () => this.props.addCharacter(card, true) }
          style={{
            padding: 20,
            borderRadius: 20,
            backgroundColor: 'purple',
            marginTop: 20,
          }}>
          <Text>{ `Add Elite Character (${card.get('pointsElite')})` }</Text>
        </TouchableOpacity>;
    }

    return (
      <View style={{
        flex: 1,
        backgroundColor: 'orange',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text>{ card.get('name') }</Text>

        <TouchableOpacity
          onPress={ () => this.props.addCharacter(card, false) }
          style={{
            padding: 20,
            borderRadius: 20,
            backgroundColor: 'purple',
            marginTop: 20,
          }}>
          <Text>{ `Add Regular Character (${card.get('pointsRegular')})` }</Text>
        </TouchableOpacity>

        { eliteButton }
      </View>
    );
  }
}

const mapStateToProps = state => ({ deckState: state.deckReducer });

const mapDispatchToProps = { addCharacter };

export default connect(mapStateToProps, mapDispatchToProps)(SearchDetailsScreen);
