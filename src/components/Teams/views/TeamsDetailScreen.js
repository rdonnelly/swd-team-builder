import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import Swiper from 'react-native-swiper';

import { cardImages } from '../../../lib/DestinyImages';


const styles = StyleSheet.create({
  swiper: {
    flex: 1,
    height: 200,
  },
  imageWrapper: {
    flex: 1,
    height: 240,
    paddingVertical: 16
  },
});


class TeamsDetailScreen extends React.Component {
  static navigationOptions = {
    title: 'Team Details',
  }

  render() {
    const teamKey = this.props.navigation.state.params.key;
    const { teamsState } = this.props;
    const team = teamsState.get('teams')
      .find(teamObj => teamObj.get('key') === this.props.navigation.state.params.key);

    const imageViews = team.get('characters').map((character) => {
      return (
        <View key={ character.get('id') } style={ styles.imageWrapper }>
          <Image
            resizeMode='contain'
            source={ cardImages.get(character.get('id')) }
            style={{ flex: 1 }}
          />
        </View>
      );
    }).toJS();

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
          <View>
            <Text>Woooooo</Text>
            <Text>{ teamKey }</Text>
          </View>
          <Swiper height={ 272 }>
            { imageViews }
          </Swiper>
        </ScrollView>
      </View>
    );
  }
}

TeamsDetailScreen.propTypes = {
  navigation: React.PropTypes.object.isRequired,

  teamsState: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  teamsState: state.teamsReducer,
});

export default connect(mapStateToProps)(TeamsDetailScreen);
