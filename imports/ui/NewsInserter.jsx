import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import { Accounts } from 'meteor/accounts-base'
import { createContainer } from 'meteor/react-meteor-data'
import { News } from '../api/collectionfuncs.js';
import Login from './Login.jsx';
import ContentEditable from 'react-contenteditable';
import { Container } from 'semantic-ui-react'

class NewsInserter extends Component {

  constructor(props) {
      super(props);
      this.state = {
        headContent: '',
        introContent: '',
        newsContent: '',
      };

      this.submitNews = this.submitNews.bind(this);
      this.showcollection = this.showcollection.bind(this);
      this.clear = this.clear.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.introStateSet = this.introStateSet.bind(this);
      this.headStateSet = this.headStateSet.bind(this);
  }

  submitNews(e) {
    e.preventDefault();

    const header = this.state.headContent;
    const intro = this.state.introContent
    const text = this.state.newsContent;

    Meteor.call('news.insert', header, intro, text);
    this.setState({
      headContent: '',
      introContent: '',
      newsContent: '',
    });
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

  handleChange(e) {
    e.preventDefault();

    this.setState({
      newsContent: e.target.value
    });
  }

  introStateSet (e) {
    e.preventDefault();

    this.setState({
      introContent: e.target.value
    });
  }

  headStateSet(e) {
    e.preventDefault();

    this.setState({
      headContent: e.target.value
    });
  }

  redactorPanel() {
    if(this.props.currentUser) {

      if(this.props.currentUser.profile.flag === 'admin' || this.props.currentUser.profile.flag === 'redactor') {
        return  <form onSubmit={this.submitNews}>
          <h2>Redactor main panel</h2>

          <h3>Title</h3>
          <ContentEditable
                id="headInsertBox"
                html={this.state.headContent}
                onChange={this.headStateSet}
          />

          <h3>Subtitle (optional)</h3>
          <ContentEditable
                id="introInsertBox"
                html={this.state.introContent}
                onChange={this.introStateSet}
          />

          <h3>Content</h3>
          <ContentEditable
                id="newsInsertBox"
                html={this.state.newsContent}
                onChange={this.handleChange}
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

        <Login />

        <Container text>
          <p>Ony redactor can type news</p>
          {this.redactorPanel()}
        </Container>

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