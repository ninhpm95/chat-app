import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

class MessageComponent extends Component {
  state = { width: 400 };

  updateDimensions = () => {
    this.setState({ width: window.innerWidth });
  };

  componentDidMount () {
    this.setState({ width: window.innerWidth });
    window.addEventListener('resize', this.updateDimensions);
    this.scrollToLastMessage();
  }

  componentDidUpdate () {
    this.scrollToLastMessage();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  scrollToLastMessage = () => (
    this.MessageListWrapperDiv.scrollTop = this.MessageListWrapperDiv.scrollHeight
  );

  render () {
    let { activeUser, messages } = this.props;
    let charactersPerLine = Math.floor(this.state.width / 20);
    let textSplitPattern = new RegExp(".{1," + charactersPerLine + "}", "g");

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
                  text.length <= charactersPerLine ? text : text.match(textSplitPattern).join('\n')
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
    messages: state.messages
  })
)(MessageComponent);
