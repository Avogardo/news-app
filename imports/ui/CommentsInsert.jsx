import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import { Accounts } from 'meteor/accounts-base'
import { createContainer } from 'meteor/react-meteor-data'
import { Comments } from '../api/collectionfuncs.js';


class CommentsInsert extends Component {

    constructor(props) {
        super(props);
        this.submitComment = this.submitComment.bind(this);
        this.showcomments = this.showcomments.bind(this);
        this.clear = this.clear.bind(this);
    }

  renderComments(id) {
    const currentUserId = this.props.currentUser && this.props.currentUser._id;
    const idAdmin = this.props.currentUser && this.props.currentUser.profile.flag;
      if(typeof this.props.comments[0] !== 'undefined') {
        let result = this.props.comments.filter(function( obj ) {
          return obj.newsId == id;
        });

        return result.map((comment) => {

let content = comment.text.replace( /\n/g, '<br>');
console.log(content);





          return <li key={comment._id}>
            <p><time>{moment(comment.createdAt).calendar()}</time></p>
            <strong>{comment.owner}</strong>: <div id={comment._id} dangerouslySetInnerHTML={this.innetText(content)} />
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

  innetText(text) {
    return {__html: text};
  }

  submitComment(e) {
    e.preventDefault();
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    const newsId = this.props.newsId;


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
        <h2>Comments</h2>

        <div><ul>{this.renderComments(this.props.newsId)}</ul></div>

        { this.props.currentUser ?
          <form onSubmit={this.submitComment}>

          	<textarea 
          	rows="4" 
          	cols="40" 
          	ref="textInput"
          	placeholder="Write some comment [150]"
          	maxLength="150"
          	wrap="hard"
          	required
          	/>

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

CommentsInsert.propTypes = {
  currentUser: PropTypes.object,
  comments: PropTypes.array.isRequired,
};



export default createContainer(() => {
  return {
    currentUser: Meteor.user(),
    comments: Comments.find({}).fetch(),
  };
}, CommentsInsert);

Meteor.subscribe('comments');