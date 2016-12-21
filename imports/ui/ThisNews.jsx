import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import { Accounts } from 'meteor/accounts-base'
import { createContainer } from 'meteor/react-meteor-data'
import { News, Comments } from '../api/collectionfuncs.js';


class ThisNews extends Component {

    constructor(props) {
        super(props);
        this.submitComment = this.submitComment.bind(this);
        this.showcomments = this.showcomments.bind(this);
        this.clear = this.clear.bind(this);

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
      if(typeof this.props.news[0] !== 'undefined') {
        let result = this.props.news.filter(function( obj ) {
          return obj._id == id;
        });

        const currentUserId = this.props.currentUser && this.props.currentUser._id;
        const idAdmin = this.props.currentUser && this.props.currentUser.profile.flag;

        return <div>
            <h1>{result[0].header}</h1>
            <p>{result[0].text}</p>

            {currentUserId ===  this.props.news.ownerId || idAdmin === 'admin' ? (
              <button onClick={() => Meteor.call('news.remove', this.state.linkid)}>
                remove
              </button>
            ) : ''}

        </div>
      } else {
        return <p>This news has been removed.</p>
      }
  }

  renderComments(id) {
    const currentUserId = this.props.currentUser && this.props.currentUser._id;
    const idAdmin = this.props.currentUser && this.props.currentUser.profile.flag;
      if(typeof this.props.comments[0] !== 'undefined') {
        let result = this.props.comments.filter(function( obj ) {
          return obj.newsId == id;
        });

        return result.map((comment) => {
          return <li key={comment._id}>
            <p>{moment(comment.createdAt).calendar()}</p>
            <strong>{comment.owner}</strong>: {comment.text}
            <br />
            {currentUserId === comment.ownerId || idAdmin === 'admin' ? (
              <button onClick={() => Meteor.call('comment.remove', comment._id)}>
                remove
              </button>
            ) : ''}
            <br /><br />
          </li>
        });
      }
  }

  submitComment(e) {
    e.preventDefault();
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    const newsId = this.state.linkid;


    Meteor.call('comments.insert', newsId, text);
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  clear(e) {
        e.preventDefault();

        Meteor.call('comments.removeEntire');
  }

  showcomments(e) {
      e.preventDefault();

      console.log(this.props.comments);
  }

  render() {

    return (
      <div>
        {this.renderNews(this.state.linkid)}
        <br /><br />
        <h2>Comments</h2>

        <div><ul>{this.renderComments(this.state.linkid)}</ul></div>

        { this.props.currentUser ?
          <form onSubmit={this.submitComment}>

            <input
              type="text"
              ref="textInput"
              placeholder="Write some comment"
              required
            /> <br />

            <input type="submit" value="Submit comment" />
          </form> : ''
        }

        <br /><br />
        <p>Test buttons</p>
        <form onSubmit={this.clear}><input type="submit" value="Clear entire comments" /></form>
        <form onSubmit={this.showcomments}><input type="submit" value="Show comments" /></form>
      </div>
    );
  }
}

ThisNews.propTypes = {
  currentUser: PropTypes.object,
  news: PropTypes.array.isRequired,
  comments: PropTypes.array.isRequired,
};



export default createContainer(() => {
  return {
    currentUser: Meteor.user(),
    news: News.find({}).fetch(),
    comments: Comments.find({}).fetch(),
  };
}, ThisNews);


Meteor.subscribe('news');
Meteor.subscribe('comments');