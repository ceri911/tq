import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { logout } from '../../lib/services/auth/authCreate'
import { takePosts, createPost, updatePost, deletePost } from '../../lib/services/post/postCreate'

import Post from './post';
import Sidebar from './sidebar';
import PostCreate from './post-create';

import './sidebar/sidebar.css';
import './post/post.css';

class PostContainer extends Component {

    componentDidMount() {
        this.props.takePosts()
    }

    render() {
        const { auth, posts, history } = this.props

        const editet = Object.values(this.props.posts)[0].length > 0 ? Object.values(this.props.posts)[0].map(el => {
                if(el.id == this.props.match.params.id ){
                    return el
                }
            }).filter(item => typeof item ==='object')
            : '';

        return (
            <div>
                <div className="sidebar">
                    <Sidebar logout={this.props.logout}
                             history={this.props.history}
                    />
                </div>
                <div className="content">
                    {this.props.location.pathname === "/posts" ? <Post url={this.props.history} deletePost={this.props.deletePost} user_id={auth.user.id} posts={Object.values(posts)[0]} /> : <PostCreate url={history} before={editet} update={this.props.updatePost} create={this.props.createPost} />}
                </div>
            </div>
        )
    }
}

PostContainer.propTypes = {
    posts: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    updatePost: PropTypes.func.isRequired,
    createPost: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    posts: state.posts,
    auth: state.auth
});

export default connect(mapStateToProps, {logout, takePosts, createPost, updatePost, deletePost} )(PostContainer)