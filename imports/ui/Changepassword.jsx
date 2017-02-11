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

        const oldPassword = ReactDOM.findDOMNode(this.refs.oldPassword).value.trim();
        const passwordl = ReactDOM.findDOMNode(this.refs.newPasswordl).value.trim();
        const password2 = ReactDOM.findDOMNode(this.refs.newPassword2).value.trim();

        if( passwordl === password2 ) {
            let digest = Package.sha.SHA256(oldPassword);

            Meteor.call('user.checkPassword', digest, (err, result) => {
              if(result) {
                digest = Package.sha.SHA256(password2);
                Meteor.call('user.checkPassword', digest, (err, result) => {
                  if(result) {
                    this.setState({
                        wasUpdated: true
                    });
                  } else {
                    const success = document.createElement('p');
                    const success_content = document.createTextNode('Email has been changed');
                    success.appendChild(success_content);
                    const nameFields = ReactDOM.findDOMNode(this.refs.form);
                    const parentDiv = nameFields.parentNode;
                    parentDiv.replaceChild(success, nameFields);

                    this.setState({
                        wasUpdated: false
                    });

                    Meteor.call('user.changePassword', this.props.currentUser._id, password2, (err,result) => {
                        if( err ) {
                            this.setState({
                                wasUpdated: true
                            });
                            console.log("error reason: " + err.reason)
                        }
                    })
                  }
                });
              } else {
                this.setState({
                    wasUpdated: true
                });
              }
            });
        } else {
            ReactDOM.findDOMNode(this.refs.oldPassword).value = '';
            ReactDOM.findDOMNode(this.refs.newPasswordl).value = '';
            ReactDOM.findDOMNode(this.refs.newPassword2).value = '';

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
                        <Link to="/"><h3>Log in please.</h3></Link>
                    </div> :

                    <div>
                        <h3>Here you can change your password</h3>
                        <form ref="form" onSubmit={(e) => this.update(e)}>
                            <input 
                                type="password" 
                                placeholder="Old password" 
                                ref="oldPassword" 
                                required
                            /> <br />
                            <input 
                                type="password" 
                                placeholder="New password" 
                                ref="newPasswordl" 
                                required
                            /> <br />
                            <input 
                                type="password" 
                                placeholder="Repeat new password" 
                                ref="newPassword2" 
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
