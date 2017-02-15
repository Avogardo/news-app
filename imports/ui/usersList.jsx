import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import { createContainer } from 'meteor/react-meteor-data'


class usersList extends Component {

    renderUsers(users) {
      if(typeof users[0] !== 'undefined') {

        return users.map((user) => {
          return <li key={user._id}>
            <p>Name: {user._id === this.props.currentUser._id? 
                <strong><Link to={'/users/main/'+user._id}>{user.profile.name}</Link></strong> : 
                <Link to={'/user/'+user._id}>{user.profile.name}</Link>}</p>

                {user.profile.flag? <select value={user.profile.flag} onChange={(e) => this.changeFlag(e.target.value, user._id)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="redactor">Redactor</option>
                </select> : <p>Google user</p>
                }
            <button onClick={() => Meteor.call('user.remove', user._id)}>Remove</button>
          </li>
        });
      }
    }

    changeFlag(flag, id) {
        Meteor.call('user.updateFlag', id, flag);
    }

    render() {
        return (
            <div>
                {!this.props.currentUser ||  this.props.currentUser._id !== this.props.params.userId || this.props.currentUser.profile.flag !== 'admin'?
                    <div>
                        <h3>You have no permission.</h3>
                    </div> :

                    <div>
                        <h3>Here you can menage users</h3>

                        <div><ul>{this.renderUsers(this.props.userList)}</ul></div>
                    </div>
                }
            </div>
        );
    }
}

usersList.propTypes = {
  currentUser: PropTypes.object,
  userList: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    currentUser: Meteor.user(),
    userList: Meteor.users.find({}).fetch(),
  };
}, usersList);

Meteor.subscribe('userList');
