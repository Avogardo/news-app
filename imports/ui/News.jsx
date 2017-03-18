import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import Login from './Login.jsx'

export default class News extends Component {

  render() {
    return (
      <div id="news">

        <Login />

        <div id="children">
          {this.props.children}
        </div>
      </div>
    );
  }
}