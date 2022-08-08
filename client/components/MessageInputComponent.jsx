import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  SET_STATUS_TO_TYPING,
  SEND_MESSAGE
} from '../const/ClientActionTypes';

class MessageInputComponent extends Component {
  state = { message: '' };

  setMessageText = text => {
    this.setState(
      { message: text },
      () => this.props.onTyping(this.state.message)
    );
  }

  sendMessageEvent = event => {
    event.preventDefault();
    this.props.onSendingMessage(this.state.message);
    this.setMessageText('');
  }

  handleOnChangeEvent = event => {
    this.setMessageText(event.target.value);
  }

  handleOnKeyPressEvent = event => {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        event.preventDefault();
        event.target.value += '\n';
        this.setMessageText(event.target.value);
      } else if (this.state.message === '') {
        event.preventDefault();
      } else {
        this.sendMessageEvent(event);
      }
    }
  }

  render () {
    return (
      <div className="message-input-wrapper">
        <textarea
          placeholder="Enter a message"
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
  () => ({}),
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
