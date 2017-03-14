import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import { Accounts } from 'meteor/accounts-base'
import { createContainer } from 'meteor/react-meteor-data'
import { News } from '../api/collectionfuncs.js';
import NewsContainer from './NewsContainer.jsx';

class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
          wasCreated: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.showcollection = this.showcollection.bind(this);
        this.clear = this.clear.bind(this);
        this.sendveryfication = this.sendveryfication.bind(this);
    }

  handleSubmit(e) {
    e.preventDefault();

    const username = ReactDOM.findDOMNode(this.refs.usernameInput).value.trim();
    const email = ReactDOM.findDOMNode(this.refs.emailInput).value.trim();
    const password = ReactDOM.findDOMNode(this.refs.passwordInput).value.trim();

    Meteor.call('user.insert', email, username, password, ( error, response ) => {
      if ( error ) {
        console.log(error);
      } else {
        Meteor.call( 'sendVerificationLink', ( error, response ) => {
          if ( error ) {
            console.log(error.reason);
          } else {
            console.log('veryfication link has been send');
          }
        });
      }
    });

    ReactDOM.findDOMNode(this.refs.usernameInput).value = '';
    ReactDOM.findDOMNode(this.refs.emailInput).value = '';
    ReactDOM.findDOMNode(this.refs.passwordInput).value = '';

    this.setState({
      wasCreated: true
    });
  }

  sendveryfication(e) {
    e.preventDefault();
    Meteor.call( 'sendVerificationLink');
  }

  clear(e) {
        e.preventDefault();

        Meteor.call('user.allremove');
  }

  showcollection(e) {
      e.preventDefault();

      console.log(this.props.userList);
  }

  render() {

    return (
      <div className="container">
      <h1><Link to="/">Lolnet</Link></h1>

        Sign up

        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            ref="usernameInput"
            placeholder="Name"
            required
          /> <br />
          <input
            type="email"
            ref="emailInput"
            placeholder="Email addres"
            required
          /> <br />
          <input
            type="password"
            ref="passwordInput"
            placeholder="Password"
            required
          /> <br />
          <input type="submit" value="Creact account" />
        </form>

        {this.state.wasCreated ?
          <div>
            <br />
            <strong><Link to="/">Now you can log in</Link></strong>
          </div> : ''
        }



        <br /><br />
        <p>Test buttons</p>
        <form onSubmit={this.clear}><input type="submit" value="Remove user" /></form>
        <form onSubmit={this.showcollection}><input type="submit" value="Show collection" /></form>
        <form onSubmit={this.sendveryfication}><input type="submit" value="sendveryfication" /></form>
      </div>
    );
  }
}

SignUp.propTypes = {
  currentUser: PropTypes.object,
  userList: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    currentUser: Meteor.user(),
    userList: Meteor.users.find({}).fetch(),
  };
}, SignUp);

Meteor.subscribe('userList');