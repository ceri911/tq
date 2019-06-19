import { ComponentType } from 'react';

import { connect } from 'react-redux';

import React, { Component } from 'react';
import { Route, Redirect } from "react-router-dom";

class PrivateRoute extends Component
{
    render()
    {
        const { component: Component, auth } = this.props;
        return (
            <Route
                render={
                    (props) => auth.isAuthenticated
                        ? (<Component {...props} />)
                        : (<Redirect to={{ pathname: "/login", state: { from: props.location }}} />)
                }
            />
        )
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
