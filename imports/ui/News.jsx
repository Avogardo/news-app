import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import Login from './Login.jsx'

export default class News extends Component {

  render() {
    return (
      <div id="news">
        <h1><Link to="/">Lolnet</Link></h1>

        <Login />

        <div id="children">
          {this.props.children}
        </div>
      </div>
    );
  }
}