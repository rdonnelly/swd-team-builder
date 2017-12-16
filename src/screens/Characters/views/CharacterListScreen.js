import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  VirtualizedList,
} from 'react-native';
import { connect } from 'react-redux';

import CharacterListItem, { ITEM_HEIGHT } from '../../../components/CharacterListItem';
import SelectedCharacters from '../../../components/SelectedCharacters';

import { getCharacters } from '../../../selectors/characterSelectors';


const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(236, 240, 241, 1.0)',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  list: {
    width: '100%',
  },
  row: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(189, 195, 199, 1.0)',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  incompatibleRow: {
    borderColor: 'rgba(189, 195, 199, 1.0)',
    paddingVertical: 6,
  },
  cardLogo: {
    color: 'rgba(189, 195, 199, 1.0)',
    fontSize: 24,
    textAlign: 'center',
    width: 36,
  },
  incompatibleCardLogo: {
    color: 'rgba(189, 195, 199, 1.0)',
    fontSize: 20,
    paddingHorizontal: 2,
  },
  cardName: {
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 20,
  },
  incompatibleCardName: {
    color: 'rgba(189, 195, 199, 1.0)',
    fontSize: 16,
  },
  cardUnique: {
    color: 'rgba(149, 165, 166, 1.0)',
    fontSize: 16,
  },
  incompatibleCardUnique: {
    color: 'rgba(189, 195, 199, 1.0)',
  },
  cardInfo: {
    color: 'rgba(149, 165, 166, 1.0)',
    fontSize: 13,
    fontWeight: '500',
  },
  incompatibleCardInfo: {
    color: 'rgba(189, 195, 199, 1.0)',
    fontSize: 12,
  },
  cardInfoLogo: {
    color: 'rgba(149, 165, 166, 1.0)',
    fontSize: 10,
  },
  incompatibleCardInfoLogo: {
    color: 'rgba(189, 195, 199, 1.0)',
  },
  blueCard: {
    color: 'rgba(52, 152, 219, 1.0)',
  },
  redCard: {
    color: 'rgba(231, 76, 60, 1.0)',
  },
  yellowCard: {
    color: 'rgba(241, 196, 15, 1.0)',
  },
  arrow: {
    color: 'rgba(149, 165, 166, 1.0)',
    marginTop: 2,
  },
  arrowIncompatible: {
    color: 'rgba(189, 195, 199, 1.0)',
  },
});


class CharacterListView extends Component {
  static navigationOptions = {
    title: 'Characters',
    headerTintColor: 'rgba(255, 255, 255, 1.0)',
    headerStyle: {
      backgroundColor: 'rgba(155, 89, 182, 1.0)',
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      characters: this.props.characters,
    };

    this.renderItem = this.renderItem.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.characters.equals(nextProps.characters)) {
      this.setState({
        characters: nextProps.characters,
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    if (!this.state.characters.equals(nextProps.characters)) {
      return true;
    }

    return false;
  }

  renderItem({ item: characterObject }) {
    const { navigate } = this.props.navigation;

    return (
      <CharacterListItem
        characterObject={ characterObject }
        navigate={ navigate }
      />
    );
  }

  getItemLayout(data, index) {
    return {
      offset: ITEM_HEIGHT * index,
      length: ITEM_HEIGHT,
      index,
    };
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={ styles.container }>
        <VirtualizedList
          style={ styles.list }
          data={ this.state.characters }
          renderItem={ this.renderItem }
          getItem={ (data, key) => data.get(key) }
          getItemCount={ data => (data.size || data.count || 0) }
          keyExtractor={ item => `character_list__${item.get('id')}` }
          getItemLayout={ this.getItemLayout }
        />
        <SelectedCharacters navigate={ navigate }></SelectedCharacters>
      </View>
    );
  }
}

CharacterListView.propTypes = {
  characters: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  characters: getCharacters(state),
});

export default connect(mapStateToProps)(CharacterListView);
