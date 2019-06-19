import axios from "axios";
import PostActions from './postActions';

const LOCAL_HOST = 'http://localhost:3001'; //hardcode

export const setCurrentPosts = data => {
    return {
        type: PostActions.SET_CURRENT_POSTS,
        payload: data
    };
};

export const takePosts = () => dispatch => {
    return axios.post(`${LOCAL_HOST}/api/takePosts`).then(res => {
        dispatch(setCurrentPosts(res.data));
    }).catch(err => {
        console.log(err)
    })
};

export const createPost = (data, url) => dispatch => {
    return axios.post(`${LOCAL_HOST}/api/createPost`, data).then(res => {
        dispatch(takePosts())
        url.push('/login')
    }).catch(err => {
        console.log(err);
        dispatch({
            type: PostActions.GET_ERRORS_POST,
            payload: err
        })
    });
};

export const updatePost = (data, id, url) => dispatch => {
    data.id = id
    return axios.post(`${LOCAL_HOST}/api/updatePost`, data).then(res => {
        dispatch(takePosts())
        url.push('/login')
    }).catch(err => {
        console.log(err);
        dispatch({
            type: PostActions.GET_ERRORS_POST,
            payload: err
        })
    });
};

export const deletePost = (id) => dispatch => {
    return axios.post(`${LOCAL_HOST}/api/deletePost`, id).then(res => {
        dispatch(takePosts())
    }).catch(err => {
        console.log(err);
        dispatch({
            type: PostActions.GET_ERRORS_POST,
            payload: err
        })
    });
};