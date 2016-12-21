import React, { Component } from 'react';
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'

export default class Bye extends Component {

  render() {
    return (
      <div>
        <h1>News bye</h1>
        <li><Link to="/news/hello/kajko">Hello</Link></li>
        <li><Link to="/news/bye">Bye</Link></li>
      </div>
    );
  }
}