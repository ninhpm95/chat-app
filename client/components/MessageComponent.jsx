import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

class MessageComponent extends Component {
  // Browser's width information, which is used for adjusting characters displayed per line for messages
  state = { width: 400 };

  // Update browser's width information
  updateDimensions = () => {
    this.setState({ width: window.innerWidth });
  };

  componentDidMount () {
    // Adjust browser's width information when the component is first rendered
    this.setState({ width: window.innerWidth });
    // Add event listener to update browser's width information when it's resized
    window.addEventListener('resize', this.updateDimensions);
    // Scroll to the last message in message list
    this.scrollToLastMessage();
  }

  componentDidUpdate () {
    // Scroll to the last message in message list
    this.scrollToLastMessage();
  }

  componentWillUnmount() {
    // Remove event listener that updates browser's width information when it's resized
    window.removeEventListener('resize', this.updateDimensions);
  }

  // Scroll to the last message in message list
  scrollToLastMessage = () => (
    this.MessageListWrapperDiv.scrollTop = this.MessageListWrapperDiv.scrollHeight
  );

  render () {
    let { activeUser, messages } = this.props;
    // Characters per line, changed based on brower's width
    let charactersPerLine = Math.floor(this.state.width / 20);
    // Split message into lines based on characters per line
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
                // Split message into multiple lines, based on characters per line
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
