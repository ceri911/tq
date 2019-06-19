import React from 'react';

import './sidebar.css';

const Sidebar = ({ logout, history }) => (

    <div>
        <h3 className="menu-bar-item" >Menu</h3>
        <a className="sidebar-button" onClick={ () => { history.push('/posts') } }>Posts</a>
        <a className="sidebar-button" onClick={ () => { history.push('/create-post') } }>Create post</a>
        <a className="sidebar-button" onClick={ () => { logout() } }>Log out</a>
    </div>
);

export default Sidebar;