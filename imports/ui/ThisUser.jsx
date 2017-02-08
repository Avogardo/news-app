import React, { Component, PropTypes } from 'react'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import { createContainer } from 'meteor/react-meteor-data'


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

    render() {
        return (
            <div>

                {!this.props.currentUser ||  this.props.currentUser._id !== this.props.params.userId?
                    <div>
                        <h3>You have no permission.</h3>
                    </div> :

                    <div>
                        <ul>
                            <li>Name: {this.props.currentUser.profile.name}</li>
                            <li>Flag: {this.props.currentUser.profile.flag || 'Google user'}</li>
                            <li>Id: {this.props.params.userId}</li>
                            <li>Email: {this.showEmail(this.props.currentUser)}</li>
                            {this.isVerified(this.props.currentUser)}
                        </ul>
                    </div>
                }

            </div>
        );
    }
}

ThisUser.propTypes = {
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  return {
    currentUser: Meteor.user(),
  };
}, ThisUser);
//<li>State: {(!this.props.currentUser.emails[0].verified? 'verified' : 'unverified') || 'nic'}</li>
