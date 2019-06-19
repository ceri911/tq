import PostActions from './postActions'

const initialState = {
    posts: {}
}

export default function (state = initialState, action) {
    switch (action.type) {
        case PostActions.SET_CURRENT_POSTS:
            return {
                ...state,
                posts: action.payload
            };
        default:
            return state;
    }
}
