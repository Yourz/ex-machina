import React, { Component } from 'react';

import './index.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: 'normal',
        };
    }
    handleLogin = () => {
        localStorage.name = this.username.value
        this.props.history.push('/')
    }
    render() {
        return (
            <div className="login-box">
                <div className="info">请输入您的名字</div>
                <input type="text"
                    autofocus
                    ref={name => this.username = name}
                />
                <button onClick={this.handleLogin}>登录</button>
            </div>
        );
    }
}

export default Login;