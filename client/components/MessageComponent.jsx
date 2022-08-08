import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

class MessageComponent extends Component {
  componentDidMount () {
    this.scrollToLastMessage();
  }

  componentDidUpdate () {
    this.scrollToLastMessage();
  }

  scrollToLastMessage = () => (
    this.MessageListWrapperDiv.scrollTop = this.MessageListWrapperDiv.scrollHeight
  );

  render () {
    let { activeUser, messages } = this.props;

    return (
      <div className="message-list-wrapper" ref={component => this.MessageListWrapperDiv = component}>
        <ul>
          {messages.map(message => (
            <li
              key={message.id}
              className={classNames(`message`, {
                'message-me': message.userId === activeUser.id
              })}>
              <span className="message-text" style={{ whiteSpace: 'pre-line' }}>{
                message.text.split('\n').map(text =>
                  text.length <= 30 ? text : text.match(/.{1,30}/g).join('\n')
                ).join('\n')
              }</span>
              <span className="message-time">{message.time}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default connect(
  state => ({
    activeUser: state.activeUser,
    messages: Object.keys(state.messages).map(id => state.messages[id])
  })
)(MessageComponent);
