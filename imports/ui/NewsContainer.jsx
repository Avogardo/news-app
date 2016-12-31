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

createHead() {
  return {__html: this.props.news.header};
}

createNews() {
  return {__html: this.props.news.text};
}

  render() {

        const currentUserId = this.props.currentUser && this.props.currentUser._id;
        const idAdmin = this.props.currentUser && this.props.currentUser.profile.flag;
        const idRedactor = this.props.currentUser && this.props.currentUser.profile.flag;

    return (
        <article>
            <Link to={'/news/'+this.props.news._id}><h1 dangerouslySetInnerHTML={this.createHead()} /></Link>
            <div dangerouslySetInnerHTML={this.createNews()} />
            

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