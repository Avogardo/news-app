import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import { createContainer } from 'meteor/react-meteor-data'
import { News } from '../api/collectionfuncs.js';

class Messages extends Component {

    renderMessages(user, news) {

        if(user.message && news[0].text) {
            return user.message.map((message) => {
                const thisNews = news.find((obj) => obj._id === message.newsId);
                if(thisNews) {
                    return <ul key={thisNews._id}>
                        <li>
                            <h4><Link to={'/news/' + thisNews._id}>{thisNews.header}</Link></h4>
                            <p>{message.content}</p>
                        </li>
                    </ul>
                } else {
                    console.log(message.newsId);
                }
            });
        }
    }

    render() {
        return (
            <div>
                {!this.props.currentUser ||  this.props.currentUser._id !== this.props.params.userId?
                    <div>
                        <h3>You have no permission.</h3>
                    </div> :

                    <div>
                        <h3>Here you can read users feedback</h3>
                        {this.renderMessages(this.props.currentUser, this.props.news)}
                    </div>
                }
            </div>
        );
    }
}

Messages.propTypes = {
  currentUser: PropTypes.object,
  news: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    currentUser: Meteor.user(),
    news: News.find({}).fetch(),
  };
}, Messages);
