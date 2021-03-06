import React, { Component } from 'react'
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'

import App from '../ui/App.jsx'
import News from '../ui/News.jsx'
import ThisNews from '../ui/ThisNews.jsx'
import SignUp from '../ui/SignUp.jsx'
import Users from '../ui/Users.jsx'
import ThisUser from '../ui/ThisUser.jsx'
import Changename from '../ui/Changename.jsx'
import Changeemail from '../ui/Changeemail.jsx'
import Changepassword from '../ui/Changepassword.jsx'
import NewsInserter from '../ui/NewsInserter.jsx'
import usersList from '../ui/usersList.jsx'
import Messages from '../ui/Messages.jsx'
import VerifyEmail from '../ui/VerifyEmail.jsx'

export const renderRoutes = () => (
    <Router history={browserHistory}>
        <Route path="/" component={App} />
        <Route path="/signup" component={SignUp} />
        <Route path="/news" component={News} >
            <Route path="/news/:newsId" component={ThisNews}/>
        </Route>
        <Route path="/users" component={Users} >
            <Route path="/users/main/(:userId)" component={ThisUser}/>
            <Route path="/users/change-name/(:userId)" component={Changename}/>
            <Route path="/users/change-email/(:userId)" component={Changeemail}/>
            <Route path="/users/change-password/(:userId)" component={Changepassword}/>
            <Route path="/users/admin-panel/(:userId)" component={usersList}/>
            <Route path="/users/messages/(:userId)" component={Messages}/>
        </Route>
        <Route path="/user/(:userId)" component={ThisUser}/>
        <Route path="/compose" component={NewsInserter}/>
        <Route path="/verify-email/(:token)" component={VerifyEmail}/>
    </Router>
);
