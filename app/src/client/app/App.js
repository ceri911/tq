import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk'
import jwt_decode from "jwt-decode";
import { createStore, applyMiddleware } from 'redux';
import {Route, Switch, Redirect, BrowserRouter as Router} from 'react-router-dom'

import PrivateRoute from './privateRoute';
import { logout, setCurrentUser } from '../../lib/services/auth/authCreate'

import rootReducer from './rootReducer'

import PostsFeature from '../postFeature';
import Login from '../login';
import Registration from '../register';

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

if(localStorage.jwtToken){
  const currentTime = Date.now() / 1000;
  const decoded = jwt_decode(localStorage.jwtToken);
  if(decoded.exp < currentTime) {
    console.log('Токен истек');
    store.dispatch(logout());
    // const jwtToken = localStorage.getItem('jwtToken');
    // store.dispatch(getUser(jwtToken)); Заготовка под авто-замену токена
  } else {
      store.dispatch(setCurrentUser(decoded))
  }
}

export default class App extends Component {

    render()
    {
        const isOk = !!localStorage.jwtToken;
        return (
            <Provider store={store}>
                <Router>
                    <Switch>
                        <Route exact path="/" render={() => ( <Redirect to={ isOk ? "/posts" : "/login" } />) } />
                        <Route path={ "/login" } component={ Login } />
                        <Route path={ "/registration" } component={ Registration } />
                        <Route path="/update-posts/:id" render={(props) => <PostsFeature {...props} />}/>
                        <PrivateRoute path={"/posts/"} component={ PostsFeature }/>
                        <PrivateRoute path={"/create-post/"} component={ PostsFeature }/>
                    </Switch>
                </Router>
            </Provider>
        )
    }
}