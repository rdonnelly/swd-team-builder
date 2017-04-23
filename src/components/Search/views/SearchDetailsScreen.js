import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import { addCard } from '../../../actions';
import { cards } from '../../../lib/Destiny';


class SearchDetailsScreen extends React.Component {
  render() {
    const { goBack } = this.props.navigation;
    const cardId = this.props.navigation.state.params.id;
    const card = cards.get(cardId);

    return (
      <View style={{
        flex: 1,
        backgroundColor: 'orange',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text>{ card.get('name') }</Text>
        <TouchableOpacity
          onPress={ () => this.props.addCard(card.get('id')) }
          style={{
            padding: 20,
            borderRadius: 20,
            backgroundColor: 'purple',
            marginTop: 20,
          }}>
          <Text>{ 'Add Card' }</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={ () => goBack() }
          style={{
            padding: 20,
            borderRadius: 20,
            backgroundColor: 'purple',
            marginTop: 20,
          }}>
          <Text>{ 'Go back a screen this tab' }</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => ({ deckState: state.deckReducer });

const mapDispatchToProps = { addCard };

export default connect(mapStateToProps, mapDispatchToProps)(SearchDetailsScreen);
