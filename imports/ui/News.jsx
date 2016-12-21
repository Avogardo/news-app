import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import { Accounts } from 'meteor/accounts-base'
import { createContainer } from 'meteor/react-meteor-data'
import Login from './Login.jsx';

class News extends Component {

  render() {
    return (
      <div>
      <h1><Link to="/">Lolnet</Link></h1>

      <Login />

      <div>
        {this.props.children}
      </div>

      </div>
    );
  }
}

News.propTypes = {
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  return {
    currentUser: Meteor.user()
  };
}, News);