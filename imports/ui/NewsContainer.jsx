import React, { Component, PropTypes  } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import { News, Comments } from '../api/collectionfuncs.js';

class NewsContainer extends Component {

showHeader(x) {
  if(typeof x[0] !== 'undefined') {
    return x[0].header
  }
}

showText(x) {
  if(typeof x[0] !== 'undefined') {
    return x[0].text
  }
}

componentWillMount() {
    //console.log(this.props.news._id);
}

  render() {

        const currentUserId = this.props.currentUser && this.props.currentUser._id;
        const idAdmin = this.props.currentUser && this.props.currentUser.profile.flag;
        const idRedactor = this.props.currentUser && this.props.currentUser.profile.flag;

    return (
        <article>
            <h1><Link to={'/news/'+this.props.news._id}>{this.props.news.header}</Link></h1>
            <p>{this.props.news.text}</p>

            {currentUserId ===  (this.props.news.ownerId && idRedactor === 'redactor') || idAdmin === 'admin' ? (
              <button onClick={() => Meteor.call('news.remove', this.props.news._id)}>
                remove
              </button>
            ) : ''}
        </article>
    )
  }
}

NewsContainer.propTypes = {
  currentUser: PropTypes.object,
  thisnews: PropTypes.array.isRequired,
};



export default createContainer(() => {
  return {
    currentUser: Meteor.user(),
    thisnews: News.find({}).fetch(),
  };
}, NewsContainer);