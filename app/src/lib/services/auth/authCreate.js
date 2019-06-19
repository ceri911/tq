import axios from "axios";
import setAuthToken from "../../tools/setAuthToken";
import jwt_decode from "jwt-decode";
import AuthActions from './authActions';

const LOCAL_HOST = 'http://localhost:3001'; //hardcode

export const setCurrentUser = token => {
    return {
        type: AuthActions.SET_CURRENT_USER,
        payload: token
    };
};

export const logout = () => {
    return dispatch => {
        localStorage.removeItem("jwtToken");
        setAuthToken(false);
        dispatch(setCurrentUser({}));
    };
};

export const register = (user, url) => dispatch => {
    try {
    const userData = axios.post(`${LOCAL_HOST}/api/registration`, user );
    console.log(user);
    url.push('/login')
    } catch (error) {
        console.log(error);
        dispatch({
            type: AuthActions.GET_ERRORS,
            payload: error.response.data
        })
    }
}

export const login = data => {
    return dispatch => {
        return axios.post(`${LOCAL_HOST}/api/login`, data).then(res => {
            const token = res.data.token;

            localStorage.setItem("jwtToken", token);
            setAuthToken(token);
            console.log(localStorage.jwtToken)
            dispatch(setCurrentUser(jwt_decode(token)));
        }).catch(err => {
            console.log(err);
            dispatch({
                type: AuthActions.GET_ERRORS,
                payload: err.response.data
            })
        });
    };
};