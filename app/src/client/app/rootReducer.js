import { combineReducers } from 'redux';

import authReducer from '../../lib/services/auth/authReducer'
import postReducer from '../../lib/services/post/postReducer'

export default combineReducers({
    auth: authReducer,
    posts: postReducer
})