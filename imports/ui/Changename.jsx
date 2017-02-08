import React, { Component, PropTypes } from 'react'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import { createContainer } from 'meteor/react-meteor-data'


class Changename extends Component {

    render() {
        return (
            <div>

                {!this.props.currentUser ||  this.props.currentUser._id !== this.props.params.userId?
                    <div>
                        <h3>You have no permission.</h3>
                    </div> :

                    <div>
                        <h3>Here you can change your account name</h3>
                        <form>
                            <input type="text" placeholder="New name" ref="newName" /> <br />
                            <input type="text" placeholder="Repeat new name" ref="newName2" /> <br />
                            <input type="submit" />
                        </form>

                        <p>{this.props.params.userId}</p>
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
