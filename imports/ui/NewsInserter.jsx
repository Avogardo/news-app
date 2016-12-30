import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import { Accounts } from 'meteor/accounts-base'
import { createContainer } from 'meteor/react-meteor-data'
import { News } from '../api/collectionfuncs.js';
import Login from './Login.jsx';

class NewsInserter extends Component {

  constructor(props) {
      super(props);
      this.submitNews = this.submitNews.bind(this);
      this.showcollection = this.showcollection.bind(this);
      this.clear = this.clear.bind(this);
  }

  submitNews(e) {
    e.preventDefault();

    const header = ReactDOM.findDOMNode(this.refs.headerInput).value.trim();
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Meteor.call('news.insert', header, text);
    ReactDOM.findDOMNode(this.refs.headerInput).value = '';
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  clear(e) {
    e.preventDefault();

    Meteor.call('news.removeEntire');
  }

  showcollection(e) {
    e.preventDefault();

    console.log(this.props.news);
    console.log('Length: ' + News.find().count());
    console.log(this.props.currentUser._id);
    console.log(this.props.userList[0].profile.name);
  }

  redactorPanel() {
    if(this.props.currentUser) {

      if(this.props.currentUser.profile.flag === 'admin' || this.props.currentUser.profile.flag === 'redactor') {
        return  <form onSubmit={this.submitNews}>
          <h3>Redactor main panel</h3>
          <input
            type="text"
            ref="headerInput"
            placeholder="Add news head"
            required
          /> <br />

          <textarea 
          rows="30" 
          cols="70" 
          ref="textInput"
          placeholder="Add news content"
          wrap="hard"
          required
          /> <br />

          <input type="submit" value="Submit news" />
        </form>
      } else {
        return <p>You have no premission</p>
      }
    } else {
      return <p>Log in please</p>
    }
  }

  render() {

    return (
      <div>
        <h1><Link to="/">Lolnet</Link></h1>

        <Login />

        <p>Ony redactor can type news</p>
        {this.redactorPanel()}


        <br /><br />
        <p>Test buttons</p>
        <form onSubmit={this.clear}><input type="submit" value="Clear news" /></form>
        <form onSubmit={this.showcollection}><input type="submit" value="Show collection" /></form>
      </div>
    );
  }
}

NewsInserter.propTypes = {
  currentUser: PropTypes.object,
  news: PropTypes.array.isRequired,
  userList: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    currentUser: Meteor.user(),
    news: News.find({}, { sort: { createdAt: -1 } }).fetch(),
    userList: Meteor.users.find({}).fetch(),
  };
}, NewsInserter);


Meteor.subscribe('news');
Meteor.subscribe('userList');