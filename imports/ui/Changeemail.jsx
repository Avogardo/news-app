import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import { createContainer } from 'meteor/react-meteor-data'


class Changename extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wasUpdated: false,
        };
    }

    update(e) {
        e.preventDefault();

        const oldEmail = ReactDOM.findDOMNode(this.refs.odEmail).value.trim();
        const email = ReactDOM.findDOMNode(this.refs.newEmail).value.trim();
        const email2 = ReactDOM.findDOMNode(this.refs.newEmail2).value.trim();

        if( email === email2 && email2 !== this.props.currentUser.emails[0].address && oldEmail === this.props.currentUser.emails[0].address) {
            Meteor.call('user.updateEmail', this.props.currentUser._id, this.props.currentUser.emails[0].verified, this.props.currentUser.emails[0].address, email2);
            
            const success = document.createElement('p');
            const success_content = document.createTextNode('Email has been changed');
            success.appendChild(success_content);
            const nameFields = ReactDOM.findDOMNode(this.refs.form);
            const parentDiv = nameFields.parentNode;
            parentDiv.replaceChild(success, nameFields);

            this.setState({
                wasUpdated: false
            });
        } else {
            ReactDOM.findDOMNode(this.refs.odEmail).value = '';
            ReactDOM.findDOMNode(this.refs.newEmail).value = '';
            ReactDOM.findDOMNode(this.refs.newEmail2).value = '';

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
                        <h3>Here you can change your email address</h3>
                        <form ref="form" onSubmit={(e) => this.update(e)}>
                            <input 
                                type="text" 
                                placeholder="Old email" 
                                ref="odEmail" 
                                required
                            /> <br />
                            <input 
                                type="text" 
                                placeholder="New email" 
                                ref="newEmail" 
                                required
                            /> <br />
                            <input 
                                type="text" 
                                placeholder="Repeat new email" 
                                ref="newEmail2" 
                                required
                                /> <br />
                            <input type="submit" />
                        </form>
                        {this.state.wasUpdated? <p>Error</p> : ''}
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
