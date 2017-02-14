import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import { Accounts } from 'meteor/accounts-base'
import { createContainer } from 'meteor/react-meteor-data'
import { Comments } from '../api/collectionfuncs.js';

class CommentsInsert extends Component {

  constructor(props) {
      super(props);
      this.state = ({
        counter: 500
      });

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
          return <li key={comment._id} id={comment._id}>
            <p><time>{moment(comment.createdAt).calendar()}</time></p>
            <strong>{this.renderNickName(comment.ownerId)}</strong>
            : <br /> <div ref={comment._id} dangerouslySetInnerHTML={this.innetText(comment.text)} />
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
            <br />
          </li>
        });
      }
  }

  renderNickName(userId) {
    if(typeof this.props.userList[0] !== 'undefined') {
        let result = this.props.userList.filter(function( obj ) {
            return obj._id === userId;
        });

      if(!this.props.currentUser || userId !== this.props.currentUser._id) {
        return <Link to={'/user/'+userId}>{result[0].profile.name}</Link>
      } else {
        return <Link to={'/users/main/'+userId}>{result[0].profile.name}</Link>
      }
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

    const sp1 = document.createElement("textarea"); //new textarea
    sp1.ref = 'ta_'+comment._id;
    sp1.maxLength = '500';
    let sp1_content = document.createTextNode(input);
    sp1.appendChild(sp1_content);
    const sp2 = ReactDOM.findDOMNode(this.refs[comment._id]);
    const parentDiv = sp2.parentNode;
    parentDiv.replaceChild(sp1, sp2);

    let cancel = document.createElement('button'); //new cancel
    cancel.id = 'remove_'+comment._id;
    const cancel_content = document.createTextNode('cancel');
    cancel.onclick = function() {

      const parentOldDiv = sp1.parentNode; //back to div
      parentOldDiv.replaceChild(sp2, sp1);

      const parentOldRemove = cancel.parentNode; //back to remove
      parentOldRemove.replaceChild(remove, cancel);

      const parentOldEdit = update.parentNode; //back to edit
      parentOldEdit.replaceChild(edit, update);

      return false;
    };
    cancel.appendChild(cancel_content);
    const remove = ReactDOM.findDOMNode(this.refs[cancel.id]);
    const parentRemove = remove.parentNode;
    parentRemove.replaceChild(cancel, remove);

    let update = document.createElement('button'); //new update
    update.id = 'edit_'+comment._id;
    const edit_content = document.createTextNode('update');
    update.onclick = function() {
      Meteor.call('comment.update', comment._id, sp1.value);
      const parentOldDiv = sp1.parentNode;
      parentOldDiv.replaceChild(sp2, sp1);

      const parentOldRemove = cancel.parentNode; //back to remove
      parentOldRemove.replaceChild(remove, cancel);

      const parentOldEdit = update.parentNode; //back to edit
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

    this.setState({
      counter: 500
    });

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

  counterUpdate(e) {
    this.setState({
      counter: 500 - e.target.value.length
    });
  }

  render() {

    return (
      <div>
        <h2>Comments</h2>

        <div><ul>{this.renderComments(this.props.newsId)}</ul></div>

        { this.props.currentUser ?
          <form onSubmit={this.submitComment} >

          	<textarea onChange={(e) => this.counterUpdate(e)}
          	rows="4"
          	cols="40"
          	ref="textInput"
          	placeholder="Write some comment [500]"
          	maxLength="500"
          	wrap="hard"
          	required
          	/>

            <input type="submit" value="Submit comment" />
            <div>{this.state.counter}</div>
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
  userList: PropTypes.array.isRequired,
};



export default createContainer(() => {
  return {
    currentUser: Meteor.user(),
    comments: Comments.find({}).fetch(),
    userList: Meteor.users.find({}).fetch(),
  };
}, CommentsInsert);

Meteor.subscribe('comments');
