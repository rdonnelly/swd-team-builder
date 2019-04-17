import React, { Component } from 'react';

import database from '../lib/Database';

function withData() {
  return (WrappedComponent, selectData, actions) => (
    class WithDataHoc extends Component {
      constructor(props) {
        super(props);
        this.state = {
          data: null,
          dataIsLoading: true,
        };

        this.actionProps = {};
      }

      componentDidMount() {
        this.refreshData();
        database.addChangeListener(this.handleChange);
      }

      componentWillUnmount() {
        database.removeChangeListener(this.handleChange);
      }

      handleChange = () => {
        this.refreshData();
      }

      refreshData = () => {
        this.setState({
          dataIsLoading: true,
        }, async () => {
          const data = await selectData(database, this.props);
          this.setState({
            data,
            dataIsLoading: false,
          });
        });
      }

      render() {
        if (actions) {
          Object.keys(actions).forEach((key) => {
            if (!this.actionProps[key]) {
              this.actionProps[key] = (...args) => {
                actions[key](database, ...args);
                this.refreshData();
              };
            }
          });
        }

        return (
          <WrappedComponent
            data={this.state.data}
            dataIsLoading={this.state.dataIsLoading}
            {...this.actionProps}
            {...this.props}
          />
        );
      }
    }
  );
}

export default withData;
