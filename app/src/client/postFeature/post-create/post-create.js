import React, { Component } from 'react';
import '../sidebar/sidebar.css';
import '../post/post.css';

import './post-create.css';

class PostsCreate  extends Component {

    constructor() {
        super();


        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        var date = new Date();

        e.preventDefault();
        const user = {
            title: this.titleInput.value,
            text: this.textInput.value,
            token: localStorage.jwtToken,
            data: date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
        };

        this.props.before.length > 0 ? this.props.update(user, this.props.before[0].id, this.props.url) : this.props.create(user, this.props.url);
    }

    componentDidMount() {
        if(this.props.before.length > 0){
            this.titleInput.value = this.props.before[0].title;
            this.textInput.value = this.props.before[0].text;
        }
    }

    render(){

        return (
            <div>
                <div className="content">
                    <div className="conteiner-create">
                        <div className="wrap-create">
                            <form className="form-create" onSubmit={ this.handleSubmit }>
                                <div className="banner-create">
                                    <span>Form-create-post</span>
                                </div>
                                <div className="block-text-create"><input ref={(input) => this.titleInput = input } placeholder="Title" className="input-create" type="text"/></div>
                                <div className="block-text-create"><input ref={(input) => this.textInput = input } placeholder="Text" className="input-create" type="text"/></div>
                                <div className="sumbmit-post">
                                    <button type="submit" className="button-login">
                                        Save post
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PostsCreate;