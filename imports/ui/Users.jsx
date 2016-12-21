import React, { Component, PropTypes } from 'react'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import { createContainer } from 'meteor/react-meteor-data'


class Users extends Component {

    render() {
        return (
            <div>
            <h1><Link to="/">Lolnet</Link></h1>

                {!this.props.currentUser ||  this.props.currentUser._id !== this.props.params.userId?
                    <div>
                        <h3>You have no permission.</h3>
                    </div> :

                    <div>
                        <h2>Hi {this.props.currentUser.profile.flag} {this.props.currentUser.profile.name}!</h2>
                        <p>Here you can customize your account.</p>
                        <p>{this.props.params.userId}</p>
                    </div>
                }

            </div>
        );
    }
}

Users.propTypes = {
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  return {
    currentUser: Meteor.user(),
  };
}, Users);