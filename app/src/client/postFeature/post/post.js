import React, { Component } from 'react';

class Posts extends Component {

    render(){
        const posts = Object.values(this.props.posts).map(el => {
            return (
                <div key={el.id} className="container-post">
                    <div className="main-post">
                        <h3 className="title-post">{el.title}</h3>
                        <div className="content-post">{el.text}</div>
                        <div className="datas-post">
                            {
                                el.author_id === this.props.user_id ?
                                <div>
                                    <button onClick={() => { this.props.deletePost(el.id) }} className="data-post-button">Delete</button>
                                    <button onClick={() => { this.props.url.push('/update-posts/' + `${el.id}`)}} className="data-post-button">Change</button>
                                </div>
                                : ''
                            }
                            <div className="data-post">Number: {el.id}</div>
                            <div className="data-post">Author: {el.username}</div>
                            <div className="data-post">Data: {el.create_at.slice(0,10)}</div>
                        </div>
                    </div>
                </div>
            )});

        return(
            <div>
                {posts}
            </div>
        )
    }
}

export default Posts;