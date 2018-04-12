import React, { Component } from 'react';
import moment from 'moment';
import './index.css';
import { Layout, Button, Input } from 'antd';
const { Header, Footer, Content } = Layout;
const socket = window.socket;

function ChatContent(props) {
    const msgs = props.msgs;
    const listItem = msgs.map((msg) => <div className="item">
        (<span className="date">{msg.date}</span>)
        [<span className="loc">{msg.loc}</span>]
        <span className="from">{(msg.self) ? '我@' : ''}{msg.from}</span>:
        <span>{msg.content}</span>
        </div>);
    return listItem;
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msgs: localStorage.msgsGroup && JSON.parse(localStorage.msgsGroup) || [],
            inputContent: '',
            emojis: ['😂', '🙏', '😄', '😏', '😇', '😅', '😌', '😘', '😍', '🤓', '😜', '😎', '😊', '😳', '🙄', '😱', '😒', '😔', '😷', '👿', '🤗', '😩', '😤', '😣', '😰', '😴', '😬', '😭', '👻', '👍', '✌️', '👉', '👀', '🐶', '🐷', '😹', '⚡️', '🔥', '🌈', '🍏', '⚽️', '❤️', '🇨🇳'],
            isShowEmoji: false
        }
    }
    send = () => {
        if (this.state.inputContent === '') {
            return;
        } else {
            const date = moment().format('YYYY-MM-DD HH:mm:ss');
            socket.emit('sendGroupMsg', {
                date,
                loc: localStorage.addr,
                from: `${localStorage.name}`,
                content: this.state.inputContent
            });
            this.setState((prevState, props) => ({
                msgs: prevState.msgs.concat({
                    date,
                    loc: localStorage.addr,
                    from: `${localStorage.name}`,
                    content: prevState.inputContent,
                    self: true
                })
            }))
            this.setState({
                inputContent: ''
            });
            setTimeout(() => this.oContent.scrollTop = this.oContent.scrollHeight, 0);
        };
    }
    handleInput = (e) => {
        const value = e.target.value;
        this.setState({
            inputContent: value
        });
    }
    handleKeyDown = (e) => {
        if (e.which === 13) {
            this.send()
        }
    }
    login = () => {
        this.props.history.push('/login');
    }
    componentWillMount() {
        if (!localStorage.name) {
            this.login();
        }
    }
    componentDidMount() {
        this.oContent = document.querySelector('.chat-content');
        this.oContent.scrollTop = this.oContent.scrollHeight;
        socket.emit('online', localStorage.name);
        socket.on('online', (name) => {
            if (!name) {
                return;
            }
            const oOnline = document.createElement('div');
            oOnline.className = 'online';
            oOnline.innerText = name + '上线了';
            this.oContent.appendChild(oOnline);
            this.oContent.scrollTop = this.oContent.scrollHeight;
        });
        // 接收群聊消息
        socket.on('receiveGroupMsg', data => {
            this.setState((prevState, props) => ({
                msgs: prevState.msgs.concat(data)
            }))
            setTimeout(() => {
                this.oContent.scrollTop = this.oContent.scrollHeight;
            }, 0);
        });
    }
    componentWillUpdate(nextProps, nextState) {
        localStorage.msgsGroup = JSON.stringify(nextState.msgs)
    }
    render() {
        return (
            <Layout className="chat-box">
                <Header className="chat-header">
                    <Button type="primary" shape="circle" icon="user" />
                    <Button type="primary" shape="circle" icon="home" onClick={this.login}/>
                </Header>
                <Content className="chat-content">
                    <ChatContent msgs={this.state.msgs} />
                </Content>
                <Footer className="chat-footer">
                    <Button shape="circle" icon="smile" />
                    <Input className="chat-input"
                        placeholder="请输入想要说的话"
                        onChange={this.handleInput}
                        onKeyDown={this.handleKeyDown}
                        value={this.state.inputContent}
                    />
                    <Button type="primary" onClick={this.send}>发送</Button>
                </Footer>
            </Layout>
        );
    }
}

export default Home;