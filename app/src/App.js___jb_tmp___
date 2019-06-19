import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware, combineReducers } from 'redux';
import {Route, Switch, Redirect, withRouter, BrowserRouter as Router} from 'react-router-dom'

import PrivateRoute from './privateRoute';

import loginReducer from './lib/services/login/loginReducer'

import Posts from './posts';


const createRootReducer = () => combineReducers({
    loginReducer
})

const store = createStore(createRootReducer, applyMiddleware(thunkMiddleware));

const isOk = false;

export default class App extends Component {
    render()
    {
    console.log(this.props)
        return (
            <Provider store={store}>
                <Router>
                    <Switch>
                        <Route exact path="/" render={() => ( <Redirect to={ isOk ? "/posts" : "/login" } />) } />
                        {/*<Route path={ "/login" } component={ Login } />*/}
                        <PrivateRoute authorized={isOk} path={"/posts"} component={Posts}/>
                        <PrivateRoute authorized={isOk} path={"/create-post"} component={Posts}/>
                    </Switch>
                </Router>
            </Provider>
        )
    }
}