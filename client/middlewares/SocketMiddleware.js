import socket from '../socket';

import { SEND_MESSAGE, SET_STATUS_TO_TYPING } from '../const/ClientActionTypes';

import {
  USER_TYPING,
  CHANGE_USERNAME,
  MESSAGE_SENT,
  DELETE_LAST_MESSAGE
} from '../const/SocketActionTypes';

const CHANGE_USERNAME_CMD = '/change_username ';
const DELETE_LAST_MESSAGE_CMD = '/delete_last_message';

export default store => next => action => {
  if (action.type === SEND_MESSAGE) {
    if (action.payload.text === DELETE_LAST_MESSAGE_CMD) {
      socket.send(JSON.stringify({
        type: DELETE_LAST_MESSAGE,
        payload: {
          userId: action.payload.userId,
        }
      }));

    } else if (action.payload.text.startsWith(CHANGE_USERNAME_CMD)) {
      socket.send(JSON.stringify({
        type: CHANGE_USERNAME,
        payload: {
          userId: action.payload.userId,
          userName: action.payload.text.substr(CHANGE_USERNAME_CMD.length),
        }
      }));

    } else {
      socket.send(JSON.stringify({
        type: MESSAGE_SENT,
        payload: {
          userId: action.payload.userId,
          text: action.payload.text,
          type: 'normal',
          time: action.payload.time          
        }
      }));
    }
  }

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
