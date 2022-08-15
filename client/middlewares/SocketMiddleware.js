import socket from '../socket';

import { SEND_MESSAGE, SET_STATUS_TO_TYPING } from '../const/ClientActionTypes';

import {
  USER_TYPING,
  CHANGE_USERNAME,
  MESSAGE_SENT
} from '../const/SocketActionTypes';

const CHANGE_USERNAME_CMD = '/change_username ';

export default store => next => action => {
  // When user sends message to server
  if (action.type === SEND_MESSAGE) {
    // If the text indicates that user wants to change username, send such information to server
    if (action.payload.text.startsWith(CHANGE_USERNAME_CMD)) {
      socket.send(JSON.stringify({
        type: CHANGE_USERNAME,
        payload: {
          userId: action.payload.userId,
          userName: action.payload.text.substr(CHANGE_USERNAME_CMD.length),
        }
      }));    
    } else { // else, send normal message to server
      socket.send(JSON.stringify({
        type: MESSAGE_SENT,
        payload: {
          userId: action.payload.userId,
          text: action.payload.text,
          time: action.payload.time
        }
      }));
    }
  }

  // Change user's typing status: from not typing to typing and vice versa
  if (action.type === SET_STATUS_TO_TYPING) {
    socket.send(JSON.stringify({
      type: USER_TYPING,
      payload: {
        userId: action.payload.userId,
        typing: action.payload.typing
      }
    }));
  }

  return next(action);
}
