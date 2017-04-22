import React, { Component } from 'react';
import {
  TabBarIOS,
} from 'react-native';

import ResultsView from './ResultsView';
import SearchView from './SearchView';


export default class TabsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: 'search',
    };
  }

  render() {
    return (
      <TabBarIOS>
        <TabBarIOS.Item
          systemIcon='search'
          selected={this.state.selectedTab === 'search'}
          onPress={() => {
            this.setState({
              selectedTab: 'search',
            });
          }}>
          <SearchView></SearchView>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          systemIcon='most-viewed'
          selected={this.state.selectedTab === 'results'}
          onPress={() => {
            this.setState({
              selectedTab: 'results',
            });
          }}>
          <ResultsView></ResultsView>
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}
