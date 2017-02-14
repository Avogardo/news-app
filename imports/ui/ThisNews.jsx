import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import { Accounts } from 'meteor/accounts-base'
import { createContainer } from 'meteor/react-meteor-data'
import { News } from '../api/collectionfuncs.js';
import CommentsInsert from './CommentsInsert.jsx';

class ThisNews extends Component {

  constructor(props) {
      super(props);
      this.state = {
        linkid: "",
      };
  }

  componentWillMount() {
    this.setState({
      linkid: this.props.params.newsId
    });
  }

  renderNews(id) {

        let result = this.props.news.filter(function( obj ) {
          return obj._id == id;
        });

        if(result.length !== 0) {
        const currentUserId = this.props.currentUser && this.props.currentUser._id;
        const idAdmin = this.props.currentUser && this.props.currentUser.profile.flag;
        const ownerId = result[0].ownerID;

        return <div>
          <article>
              <h2 dangerouslySetInnerHTML={this.createDangerousCode(result[0].header)} />
              <h3 dangerouslySetInnerHTML={this.createDangerousCode(result[0].intro)} />
              <p dangerouslySetInnerHTML={this.createDangerousCode(result[0].text)} />

              <author>Redactor {this.renderAuthorName(result[0].ownerID)}</author> <br />
              <button onClick={(e) => this.spotMistake(e, ownerId)}>
                Send info about mistakes
              </button>
              {currentUserId ===  this.props.news.ownerId || idAdmin === 'admin' ? (
                <button onClick={() => Meteor.call('news.remove', this.state.linkid)}>
                  remove
                </button>
              ) : ''} 
          </article> <br /><br />
          <CommentsInsert
            newsId={this.state.linkid}
          />
        </div>
      } else {
        return <p>This news has been removed.</p>
      }
  }

  createDangerousCode(text) {
    return {__html: text};
  }

  spotMistake(e, authorId) {
    e.preventDefault();

    console.log(authorId);
  }

  renderAuthorName(authorId) {
    if(typeof this.props.userList[0] !== 'undefined') {
      const author = this.props.userList.find((obj) => obj._id === authorId);
      return author.profile.name
    }
  }

  render() {

    return (
      <div>
        {this.renderNews(this.state.linkid)}
      </div>
    );
  }
}

ThisNews.propTypes = {
  currentUser: PropTypes.object,
  news: PropTypes.array.isRequired,
  userList: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    currentUser: Meteor.user(),
    news: News.find({}).fetch(),
    userList: Meteor.users.find({}).fetch(),
  };
}, ThisNews);

Meteor.subscribe('news');
