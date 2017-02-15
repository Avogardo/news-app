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
      linkid: this.props.params.newsId,
      isError: false,
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
              <button ref="spotButton" onClick={(e) => this.spotMistake(e, ownerId, result[0]._id)}>
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

  spotMistake(e, authorId, newsId) {
    e.preventDefault();

    const form = document.createElement("form"); //new form
      const textarea = document.createElement("textarea"); //new textarea   
      textarea.placeholder = 'Tell us what`s wrong';
      textarea.required = true;
      form.appendChild(textarea);

      let send = document.createElement('button'); //new button
        const send_content = document.createTextNode('Send');
        send.onclick = () => {
          if(textarea.value) {
            Meteor.call('user.addMessage', authorId, textarea.value, newsId);

            const submitted = document.createElement("p"); //new paragraph
            const submitted_content = document.createTextNode('Thanx for report');
            submitted.appendChild(submitted_content);

            parentDiv.replaceChild(submitted, form);
          } else {
            if(!this.state.isError) {
              const error = document.createElement("span"); //new paragraph
              const error_content = document.createTextNode('Field is empty');
              error.appendChild(error_content);
              form.appendChild(error);

              this.setState({
                isError: true
              });
            }
          }
          return false;
        };
        send.appendChild(send_content);
        form.appendChild(send);
      let cancel = document.createElement('button'); //new button
        const cancel_content = document.createTextNode('Cancel');
        cancel.onclick = () => {
          this.setState({
            isError: false
          });
          parentDiv.replaceChild(oldButton, form);
          return false;
        };
        cancel.appendChild(cancel_content);
        form.appendChild(cancel);


    const oldButton = ReactDOM.findDOMNode(this.refs.spotButton);
    const parentDiv = oldButton.parentNode;
    parentDiv.replaceChild(form, oldButton);
  }

  renderAuthorName(authorId) {
    if(typeof this.props.userList[0] !== 'undefined') {
      const author = this.props.userList.find((obj) => obj._id === authorId);
      if(author) {
        return author.profile.name
      } else {
        return <span>is no more</span>
      }

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
