import React, { Component, PropTypes } from 'react'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import { createContainer } from 'meteor/react-meteor-data'
import Login from './Login.jsx'

class ThisUser extends Component {

    showEmail(user) {      
        if(user.services) {
            if(user.emails) {
                return user.emails[0].address
            } else {
                return user.services.google.email
            }
        }
    }

    isVerified(user) {
        if(user.services) {
            if(user.emails) {
                return <li>State: {user.emails[0].verified? 'verified' : 'unverified'}</li>
            }
        }
    }

    renderProfile(ownerId) {
        const id = ownerId;

        if(typeof this.props.userList[0] !== 'undefined') {
            let result = this.props.userList.filter(function( obj ) {
                return obj._id == id;
            });

        return <ul>
                <li>Name: {result[0].profile.name}</li>
                <li>Flag: {result[0].profile.flag || 'Google user'}</li>
                <li>Email: {this.showEmail(result[0])}</li>
                {this.isVerified(result[0])}
            </ul>
        }
    }

    guest(ownerId) {
        if(!this.props.currentUser || this.props.currentUser._id !== this.props.params.userId) {
            return <div>
                <h1><Link to="/">Lolnet</Link></h1>
                <Login />
            </div>
        }
        
    }

    render() {
        return (
            <div>
                {this.guest(this.props.params.userId)}
                {this.renderProfile(this.props.params.userId)}                
            </div>
        );
    }
}

ThisUser.propTypes = {
  currentUser: PropTypes.object,
  userList: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    currentUser: Meteor.user(),
    userList: Meteor.users.find({}).fetch(),
  };
}, ThisUser);
