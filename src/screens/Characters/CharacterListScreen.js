import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import CharacterListItem, { ITEM_HEIGHT as characterListItemHeight } from '../../components/CharacterListItem';
import SelectedCharacters, { ITEM_HEIGHT as selectedCharactersItemHeight } from '../../components/SelectedCharacters';

import { getCharactersSorted } from '../../store/selectors/characterSelectors';
import { getDeckCharactersCount } from '../../store/selectors/deckSelectors';

import { base, colors } from '../../styles';


const styles = StyleSheet.create({
  container: {
    ...base.container,
    backgroundColor: colors.lightGray,
  },
  list: {
    flex: 1,
    width: '100%',
  },
  selectedCharactersContainer: {
    ...base.floatingControls,
  },
});


class CharacterListScreen extends PureComponent {
  static navigationOptions = {
    title: 'Characters',
    headerTintColor: colors.headerTint,
    headerStyle: {
      backgroundColor: colors.headerBackground,
    },
  };

  state = {
    currentlyOpenSwipeable: null,
  };

  constructor(props) {
    super(props);

    if (props.navigation) {
      props.navigation.setParams({
        resetScreen: this.resetScreen,
      });
    }
  }

  static getItemLayout(data, index) {
    return {
      offset: characterListItemHeight * index,
      length: characterListItemHeight,
      index,
    };
  }

  closeOpenSwipeable = () => {
    const { currentlyOpenSwipeable } = this.state;

    if (currentlyOpenSwipeable) {
      currentlyOpenSwipeable.recenter();
    }
  }

  onSwipeableOpen = (event, gestureState, swipeable) => {
    const { currentlyOpenSwipeable } = this.state;
    if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
      currentlyOpenSwipeable.recenter();
    }

    this.setState({ currentlyOpenSwipeable: swipeable });
  }

  onSwipeableClose = () => {
    this.setState({ currentlyOpenSwipeable: null });
  }

  navigateToCharacterDetails = (characterId) => {
    this.props.navigation.navigate('CharacterDetailScreen', { id: characterId });
  }

  resetScreen = () => {
    if (this.listView) {
      this.listView.scrollToOffset(0);
    }
  }

  renderItem = ({ item: characterObject }) => (
    <CharacterListItem
      characterId={ characterObject.id }
      characterIsExcluded={ characterObject.isExcluded }
      characterIsIncompatible={ characterObject.isIncompatible }
      navigate={ this.navigateToCharacterDetails }
      onOpen={ this.onSwipeableOpen }
      onClose={ this.onSwipeableClose }
    />
  );

  render() {
    const { navigate } = this.props.navigation;

    const selectedCharactersHeight = 12 +
      (Math.max(1, this.props.deckCharacterCount) * selectedCharactersItemHeight);

    return (
      <View style={ styles.container }>
        <FlatList
          ref={ (component) => { this.listView = component; } }
          style={ styles.list }
          data={ this.props.characters }
          extraData={ this.state }
          renderItem={ this.renderItem }
          keyExtractor={ item => item.id }
          getItemLayout={ CharacterListScreen.getItemLayout }
          onScrollEndDrag={ this.closeOpenSwipeable }
          contentContainerStyle={{ paddingBottom: selectedCharactersHeight + 12 }}
          initialNumToRender={ 9 }
          maxToRenderPerBatch={ 9 }
          updateCellsBatchingPeriod={ 100 }
          windowSize={ 35 }
        />
        <View style={ styles.selectedCharactersContainer }>
          <SelectedCharacters navigate={ navigate }></SelectedCharacters>
        </View>
      </View>
    );
  }
}

CharacterListScreen.propTypes = {
  characters: PropTypes.array.isRequired,
  deckCharacterCount: PropTypes.number.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  characters: getCharactersSorted(state),
  deckCharacterCount: getDeckCharactersCount(state),
});

export default connect(mapStateToProps)(CharacterListScreen);
