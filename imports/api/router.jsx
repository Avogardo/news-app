import React, { Component } from 'react';
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'

import App from '../ui/App.jsx';
import News from '../ui/News.jsx';
import ThisNews from '../ui/ThisNews.jsx';
import SignUp from '../ui/SignUp.jsx';
import Users from '../ui/Users.jsx';
import NewsInserter from '../ui/NewsInserter.jsx';

export const renderRoutes = () => (
    <Router history={browserHistory}>
        <Route path="/" component={App} />
        <Route path="/signup" component={SignUp} />
        <Route path="/news" component={News} >
            <Route path="/news/:newsId" component={ThisNews}/>
        </Route>
        <Route path="/users/(:userId)" component={Users} />
        <Route path="/compose" component={NewsInserter}/>
    </Router>
);
