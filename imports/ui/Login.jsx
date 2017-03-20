import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import { Accounts } from 'meteor/accounts-base'
import { createContainer } from 'meteor/react-meteor-data'
import { Header, Segment, Menu, Button, Icon, Input } from 'semantic-ui-react'

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

  isRedactor() {
    if(this.props.currentUser) {

      if(this.props.currentUser.profile.flag === 'admin' || this.props.currentUser.profile.flag === 'redactor') {
        return <Menu.Item>
          <Button
            onClick={() => browserHistory.push('/compose')}
          >
            Redactor panel
          </Button>
        </Menu.Item>
      } else {
        return ''
      }
    } else {
      return ''
    }
  }

  render() {
    return (
      <div>
      <Segment inverted color='violet'><Header as='h1'><Link id="logo" to="/">Fakty</Link></Header></Segment>
        {!this.props.currentUser ?

      <Menu>
        <Menu.Item>
          <Button
            primary
            onClick={() => browserHistory.push('/signup')}
          >
            Sign up
          </Button>
        </Menu.Item>

        <Menu.Item>
          <Button
            color='google plus'
            onClick={this.logInGoogle}
          >
            <Icon name='google plus' /> Google Plus
          </Button>
        </Menu.Item>

          <Menu.Item position='right'>
            <form onSubmit={this.logInFun}>
              <input
                type="text"
                ref="emailInput"
                placeholder="email"
                required
              />
              <input
                type="password"
                ref="passwordInput"
                placeholder="password"
                required
              />
              <Button
                content='Log in'
                type="submit"
              />
            </form>
          </Menu.Item>
      </Menu>
           :
      <Menu>
        <Menu.Item>
          <Header size='large'>Wellcome <b><Link to={'/users/main/'+this.props.currentUser._id}> {this.props.currentUser.profile.name}</Link></b>
              {this.props.currentUser.message? <span> {this.props.currentUser.message.length}</span> : ''}</Header>
        </Menu.Item>

        {this.isRedactor()}

        <Menu.Item position='right'>
        <Button
          primary
          onClick={this.logOut}
        >
          Log out
        </Button>
        </Menu.Item>
      </Menu>
      }

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