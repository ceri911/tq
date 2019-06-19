import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login } from '../../lib/services/auth/authCreate';

import './login.css'

class Login extends Component {

    constructor() {
        super();
        this.state = {
            errors: {}
        };
        this.usernameInput = React.createRef();
        this.passwordInput = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        // console.log(this.emailInput)
        e.preventDefault();
        const user = {
            username: this.usernameInput.value,
            password: this.passwordInput.value,
        };
        this.props.login(user);
    }

    componentDidMount() {
        console.log(this.props)
        if(this.props.auth.isAuthenticated) {
            this.props.history.push('/posts');
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        if(nextProps.auth.isAuthenticated) {
            this.props.history.push('/posts')
        }
        if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    render() {
        const {errors} = this.state;
        return(
            <div className="main">
                <div className="container-login">
                    <div className="wrap-login">
                        <form className="form-login" onSubmit={ this.handleSubmit }>
                            <h2 className="sign-in">Login</h2>
                            <div className="input-div-login">
                                <input
                                    type="username"
                                    placeholder="Username"
                                    className="input-login"
                                    name="email"
                                    ref={(input) => this.usernameInput = input }
                                />

                            </div>
                            <div className="input-div-login">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="input-login"
                                    name="password"
                                    ref={(input) => this.passwordInput = input }
                                />

                            </div>
                            <div className="sumbmit-login">
                                <button type="submit" className="button-login">
                                    Login User
                                </button>
                            </div>
                            <div className="sign-up-login">
                                <span className="text-login">Don't have an account?</span>
                                <a onClick={ () => {this.props.history.push('/registration') } } style={{cursor: 'pointer'}}>SIGN UP NOW</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    // errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    // errors: state.errors
});

export default connect(mapStateToProps, { login })(Login)