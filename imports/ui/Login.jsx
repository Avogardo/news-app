import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import { Accounts } from 'meteor/accounts-base'
import { createContainer } from 'meteor/react-meteor-data'

class Login extends Component {

    constructor(props) {
        super(props);
        this.logInGoogle = this.logInGoogle.bind(this);
        this.logInFun = this.logInFun.bind(this);
        this.logOut = this.logOut.bind(this);
    }

  logInGoogle(e) {
    e.preventDefault();

    Meteor.loginWithGoogle({ requestPermissions: ['email']}, function (error) {
      if (error) {
        return console.log(error);
      }
    });
  }

    logIn() {
    if(!this.props.currentUser) {
      return  <form onSubmit={this.logInFun}>
      <h3>Log in</h3>
        <input
          type="text"
          ref="emailInput"
          placeholder="email"
          required
        /> <br />
        <input
          type="password"
          ref="passwordInput"
          placeholder="password"
          required
        /> <br />

        <input type="submit" value="Log in" />
      </form>
    } else {
      return ''
    }
  }

  logInFun(e) {
    e.preventDefault();

    const email = ReactDOM.findDOMNode(this.refs.emailInput).value.trim();
    const password = ReactDOM.findDOMNode(this.refs.passwordInput).value.trim();

    Meteor.loginWithPassword(email, password);
    ReactDOM.findDOMNode(this.refs.emailInput).value = '';
    ReactDOM.findDOMNode(this.refs.passwordInput).value = '';
  }

    logOut(e) {
    e.preventDefault();
    Meteor.logout();
  }

  render() {
    return (
      <div>
        {!this.props.currentUser ?
          <div>
            <h3>Sign up</h3>
            <Link to="/signup">sign</Link>
          </div> :
          <div>
            <p>Wellcome <b><Link to={'/users/main/'+this.props.currentUser._id}>{this.props.currentUser.profile.name}</Link></b></p>
            <form onSubmit={this.logOut}>
              <input type="submit" value="Log out" />
            </form>
          </div>
        }

        {this.logIn()}

        <div>
          {!this.props.currentUser ?
            <form onSubmit={this.logInGoogle}>
              <h3>Log in with google</h3>
              <input type="submit" value="Log in with google" />
            </form>
            : ''
          }
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  return {
    currentUser: Meteor.user()
  };
}, Login);