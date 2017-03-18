import React, { Component, PropTypes } from 'react'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import { Accounts } from 'meteor/accounts-base'

export default class SignUp extends Component {

  veryfi(token) {
    Accounts.verifyEmail(token, (error) => {
          if ( error ) {
            console.log(error.reason);
          } else {
            console.log('Your account has been verified');
          }
        });
  }

  render() {
    this.veryfi(this.props.params.token);
    return (
      <span>Your account has been verified</span>
    );
  }
}
