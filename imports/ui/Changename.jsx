import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import { createContainer } from 'meteor/react-meteor-data'


class Changename extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wasUpdated: false
        };
    }

    updateName(e) {
        e.preventDefault();

        const username = ReactDOM.findDOMNode(this.refs.newName).value.trim();
        const username2 = ReactDOM.findDOMNode(this.refs.newName2).value.trim();

        if( username === username2 && username2 !== this.props.currentUser.profile.name) {
            Meteor.call('user.updateName', this.props.currentUser._id, this.props.currentUser.profile.flag, username2);
            
            const success = document.createElement('p');
            const success_content = document.createTextNode('Name has been changed');
            success.appendChild(success_content);
            const nameFields = ReactDOM.findDOMNode(this.refs.form);
            const parentDiv = nameFields.parentNode;
            parentDiv.replaceChild(success, nameFields);

            this.setState({
                wasUpdated: false
            });
        } else {
            ReactDOM.findDOMNode(this.refs.newName).value = '';
            ReactDOM.findDOMNode(this.refs.newName2).value = '';

            this.setState({
                wasUpdated: true
            });
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
                        <h3>Here you can change your account name</h3>
                        <form ref="form" onSubmit={(e) => this.updateName(e)}>
                            <input 
                                type="text" 
                                placeholder="New name" 
                                ref="newName" 
                                required
                            /> <br />
                            <input 
                                type="text" 
                                placeholder="Repeat new name" 
                                ref="newName2" 
                                required
                                /> <br />
                            <input type="submit" />
                        </form>
                        {this.state.wasUpdated? <p>Names are not same or name is already in use</p> : ''}
                    </div>
                }
            </div>
        );
    }
}

Changename.propTypes = {
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  return {
    currentUser: Meteor.user(),
  };
}, Changename);
