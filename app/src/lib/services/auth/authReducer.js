import AuthActions from './authActions'
import isEmpty from '../../tools/isEmpty'

const initialState = {
    isAuthenticated: false,
    user: {}
}

export default function (state = initialState, action) {
    switch (action.type) {
        case AuthActions.SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
            break;
        default:
            return state;
    }
}
