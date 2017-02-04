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
      //this.loko = this.loko.bind(this);
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
          return <li key={comment._id} id={comment._id}>
            <p><time>{moment(comment.createdAt).calendar()}</time></p>
            <strong>{comment.owner}</strong>: <br /> <div ref={comment._id} dangerouslySetInnerHTML={this.innetText(comment.text)} />
            <br />
            {currentUserId === comment.ownerId || idAdmin === 'admin' ? (
              <div>
                <button ref={'remove_'+comment._id} onClick={() => Meteor.call('comment.remove', comment._id)}>
                  remove
                </button>
                <button ref={'edit_'+comment._id} onClick={(e) => this.editComment(e, comment)}>
                  edit
                </button>
              </div>
            ) : ''}
            <br /><br />
          </li>
        });
      }
  }

  editComment(e, comment) {
    e.preventDefault();

      let input = comment.text;

      input = input.replace(/\<b>/g, '[b]');
      input = input.replace(/\<\/b>/g, '[/b]');

      input = input.replace(/\<i>/g, '[i]');
      input = input.replace(/\<\/i>/g, '[</i>]');

      input = input.replace(/&lt;/g, '<');
      input = input.replace(/&gt;/g, '>');

      input = input.replace(/\<br>/g, '\n');
//new textarea
    const sp1 = document.createElement("textarea");
    sp1.ref = 'ta_'+comment._id;
    sp1.maxLength = '150';
    let sp1_content = document.createTextNode(input);
    sp1.appendChild(sp1_content);
    const sp2 = ReactDOM.findDOMNode(this.refs[comment._id]);
    const parentDiv = sp2.parentNode;
    parentDiv.replaceChild(sp1, sp2);
//new cancel
    let cancel = document.createElement('button');
    cancel.id = 'remove_'+comment._id;
    const cancel_content = document.createTextNode('cancel');
    cancel.onclick = function() {
//back to div
      const parentOldDiv = sp1.parentNode;
      parentOldDiv.replaceChild(sp2, sp1);
//back to remove
      const parentOldRemove = cancel.parentNode;
      parentOldRemove.replaceChild(remove, cancel);
//back to edit
      const parentOldEdit = update.parentNode;
      parentOldEdit.replaceChild(edit, update);

      return false;
    };
    cancel.appendChild(cancel_content);
    const remove = ReactDOM.findDOMNode(this.refs[cancel.id]);
    const parentRemove = remove.parentNode;
    parentRemove.replaceChild(cancel, remove);
//new update
    let update = document.createElement('button');
    update.id = 'edit_'+comment._id;
    const edit_content = document.createTextNode('update');
    update.onclick = function() {
      Meteor.call('comment.update', comment._id, sp1.value);
      const parentOldDiv = sp1.parentNode;
      parentOldDiv.replaceChild(sp2, sp1);
//back to remove
      const parentOldRemove = cancel.parentNode;
      parentOldRemove.replaceChild(remove, cancel);
//back to edit
      const parentOldEdit = update.parentNode;
      parentOldEdit.replaceChild(edit, update);

      return false;
    };
    update.appendChild(edit_content);
    const edit = ReactDOM.findDOMNode(this.refs[update.id]);
    const parentEdit = edit.parentNode;
    parentEdit.replaceChild(update, edit);
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
