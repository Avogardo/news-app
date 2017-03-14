import React, { Component, PropTypes } from 'react'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import { Accounts } from 'meteor/accounts-base'

export default class SignUp extends Component {

  render() {

    return (
      <span>Token: {this.props.params.token}</span>
    );
  }
}
