import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import { createContainer } from 'meteor/react-meteor-data'

class Users extends Component {

    showcollection(e) {
        e.preventDefault();

        console.log(this.props.userList);
    }

    isGoogleUser(user) {
    	if(user.profile.flag) {
    		return <ul>
    					<li><Link to={'/users/main/'+this.props.currentUser._id}>Preview</Link></li>
    					<li>Options</li>
						  	<ul>
						  		<li><Link to={'/users/change-name/'+this.props.currentUser._id}>Change name</Link></li>
						  		<li><Link to={'/users/change-email/'+this.props.currentUser._id}>Change email</Link></li>
						  		<li><Link to={'/users/change-password/'+this.props.currentUser._id}>Change password</Link></li>
						  	</ul>
					</ul>
    	} else {
    		return <ul>
    					<li><Link to={'/users/main/'+this.props.currentUser._id}>Preview</Link></li>
					</ul>
    	}
    }

    render() {
        return (
            <div>
            <h1><Link to="/">Lolnet</Link></h1>

                {!this.props.currentUser ||  this.props.currentUser._id !== this.props.params.userId?
                    <div>
                        <h3>You have no permission.</h3>
                    </div> :

                    <div>
                    	<h2>Hi {this.props.currentUser.profile.flag  || 'user'} {this.props.currentUser.profile.name}!</h2>
						  
						{this.isGoogleUser(this.props.currentUser)}
						
                        <div>
                          {this.props.children}
                        </div>

                        <br /><br /> <p>Test button</p>
                        <form onSubmit={(e) => this.showcollection(e)}><input type="submit" value="Show collection" /></form>
                    </div>
                }
                
            </div>
        );
    }
}

Users.propTypes = {
  currentUser: PropTypes.object,
  userList: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    currentUser: Meteor.user(),
    userList: Meteor.users.find({}).fetch(),
  };
}, Users);
