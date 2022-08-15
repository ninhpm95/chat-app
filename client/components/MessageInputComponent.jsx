import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  SET_STATUS_TO_TYPING,
  SEND_MESSAGE
} from '../const/ClientActionTypes';

import i18n from "../i18n"; // Internationalization

class MessageInputComponent extends Component {
  state = { message: '' };

  setMessageText = text => {
    this.setState(
      { message: text },
      () => {        
        let userIndex = this.props.users.findIndex(user => user.id === this.props.activeUser.id);
        // Check if user is typing (User is typing if their message box contains text)
        let isTyping = !!this.state.message.length;
        // Send data to server if the data is different from the original data
        if (this.props.users[userIndex].typing !== isTyping) {
          this.props.onTyping(this.state.message);
        }        
      }
    );
  }

  // Send message (non-empty) when user presses Enter, reset message box to its original state
  sendMessageEvent = event => {
    event.preventDefault();
    this.props.onSendingMessage(this.state.message);
    this.setMessageText('');
  }

  // Message box is changed
  handleOnChangeEvent = event => {
    this.setMessageText(event.target.value);
  }

  // User presses Enter
  handleOnKeyPressEvent = event => {
    if (event.key === 'Enter') {      
      if (event.shiftKey) { // User presses Shift + Enter, ignore
        // event.preventDefault();
        // event.target.value += '\n';
        // this.setMessageText(event.target.value);
      } else if (this.state.message === '') { // User intends to send empty message => not allowed
        event.preventDefault();
      } else {
        this.sendMessageEvent(event); // Send message
      }
    }
  }

  render () {
    return (
      <div className="message-input-wrapper">
        <textarea
          placeholder={i18n.t('messageInput.send')}
          value={this.state.message}
          onChange={this.handleOnChangeEvent}
          onKeyPress={this.handleOnKeyPressEvent}
          autoFocus={true}
        />
      </div>
    );
  };
}

export default connect(
  state => ({
    language: state.application.language, // language of the app
    activeUser: state.activeUser,
    users: state.users
  }),
  dispatch => ({
    onTyping: text => dispatch({
      type: SET_STATUS_TO_TYPING,
      payload: { typing: !!text.length }
    }),
    onSendingMessage: text => dispatch({
      type: SEND_MESSAGE,
      payload: { text }
    })
  })
)(MessageInputComponent);
