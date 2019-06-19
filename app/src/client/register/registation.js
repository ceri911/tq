import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { register } from '../../lib/services/auth/authCreate';

class Register extends Component {

    constructor() {
        super();
        this.state = {
            errors: {}
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const user = {
            username: this.nameInput.value,
            password: this.passwordInput.value,
            email: this.emailInput.value
        };
        this.props.register(user, this.props.history);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.auth.isAuthenticated) {
            this.props.history.push('/')
        }
        if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    componentDidMount() {
        if(this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    render() {
        const { errors } = this.state;
        return(
            <div className="main">
                <div className="container-login">
                    <div className="wrap-login">

                        <form className="form-login" onSubmit={ this.handleSubmit }>
                            <h2 className="sign-in">Registration</h2>
                            <div className="input-div-login">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="input-login"
                                    name="name"
                                    ref={(input) => this.nameInput = input }
                                    value={ this.state.name }
                                />
                                {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
                            </div>
                            <div className="input-div-login">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="input-login"
                                    name="email"
                                    ref={(input) => this.emailInput = input }
                                    value={ this.state.email }
                                />
                                {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                            </div>
                            <div className="input-div-login">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="input-login"
                                    name="password"
                                    ref={(input) => this.passwordInput = input }
                                    value={ this.state.password }
                                />
                                {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                            </div>
                            <div className="sumbmit-login">
                                <button type="submit" className="button-login">
                                    Register User
                                </button>
                            </div>
                            <div className="sign-up-login">
                                <span className="text-login">Already have an account?</span>
                                <a onClick={ () => {this.props.history.push('/login') } } style={{cursor: 'pointer'}}>SIGN IN NOW</a>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        )
    }
}

Register.propTypes = {
    register: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    // errors: state.errors
});

export default connect(mapStateToProps,{ register })(withRouter(Register))