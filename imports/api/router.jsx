import React, { Component } from 'react';
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'

import App from '../ui/App.jsx';
import Hello from '../ui/Hello.jsx';
import Bye from '../ui/Bye.jsx';
import News from '../ui/News.jsx';
import ThisNews from '../ui/ThisNews.jsx';
import SignUp from '../ui/SignUp.jsx';
import Users from '../ui/Users.jsx';

export const renderRoutes = () => (
    <Router history={browserHistory}>
        <Route path="/" component={App} />
        <Route path="/signup" component={SignUp} />
        <Route path="/news" component={News} >
            <Route path="/news/hello/(:value)" component={Hello}/>
            <Route path="/news/:newsId" component={ThisNews}/>
            <Route path="/news/bye" component={Bye}/>
        </Route>
        <Route path="/users/(:userId)" component={Users} />
    </Router>
);
