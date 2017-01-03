import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import { Accounts } from 'meteor/accounts-base'
import { createContainer } from 'meteor/react-meteor-data'
import { Email } from 'meteor/email';
import { News } from '../api/collectionfuncs.js';
import NewsContainer from './NewsContainer.jsx';
import Login from './Login.jsx';
import NewsInserter from './NewsInserter.jsx';


class App extends Component {

  constructor(props) {
      super(props);
      this.showcollection = this.showcollection.bind(this);
      this.clear = this.clear.bind(this);
      this.sendEmail = this.sendEmail.bind(this);
  }

  createAdmin() {
    if(typeof this.props.userList[0] !== 'undefined') {
      let result = this.props.userList.filter(function( obj ) {
        return obj.profile.flag === 'admin';
      });

      if(result.length === 0) {
        Meteor.call('admin.insert', 'admin@admin.com', 'admin', 'admin');
      }
    }
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

  renderNews() {
    let news = this.props.news;

    return news.map((news) => {

      return (
        <NewsContainer
          key={news._id}
          news={news}
        />
      );
    });
  }

  sendEmail(e) {
    e.preventDefault();

    Meteor.call('sendEmail',
            'avogardo0@gmail.com',
            'michal@michalzone.com',
            'Na pewno nie Michał, gra planszowa',
            'Jak tam giera hehe LOL kek juh juh naoah tra ta ta');
  }

  isRedactor() {
    if(this.props.currentUser) {

      if(this.props.currentUser.profile.flag === 'admin' || this.props.currentUser.profile.flag === 'redactor') {
        return <button onClick={() => browserHistory.push('/compose')}>
          Redactor panel
        </button>
      } else {
        return ''
      }
    } else {
      return ''
    }
  }

  render() {

    if(!this.props.currentUser){
      this.createAdmin();
    }

    return (
      <div>
        <h1>Lolnet</h1>

        <Login />

        {this.isRedactor()}

        <ul>
          {this.renderNews()}
        </ul>


        <br /><br />
        <p>Test buttons</p>
        <form onSubmit={this.clear}><input type="submit" value="Clear news" /></form>
        <form onSubmit={this.showcollection}><input type="submit" value="Show collection" /></form>
        <form onSubmit={this.sendEmail}><input type="submit" value="Send email (disable)" disabled/></form>
      </div>
    );
  }
}

App.propTypes = {
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
}, App);


Meteor.subscribe('news');
Meteor.subscribe('userList');