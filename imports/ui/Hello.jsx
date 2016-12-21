import React, { Component } from 'react';
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

export default class Hello extends Component {

  render() {
    return (
      <div className="container">
        <h1>News hello {this.props.params.value}</h1>
        <li><Link to="/news/hello/kajko">Hello</Link></li>
        <li><Link to="/news/bye">Bye</Link></li>
      </div>
    );
  }
}