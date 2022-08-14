import {
  START_APP,
  UPDATE_USER_LIST,
  UPDATE_MESSAGE_LIST
} from './const/ClientActionTypes';

import {
  USER_CONNECTED,
  USER_LIST_UPDATED,

  MESSAGE_RECEIVED,
  MESSAGE_LIST_UPDATED,
} from './const/SocketActionTypes';

import store from './store';

const APPLICATION_HOST = process.env.REACT_APP_APPLICATION_HOST;
const SOCKET_PORT = process.env.REACT_APP_SOCKET_PORT;

let socket = new WebSocket(`ws://${APPLICATION_HOST}:${SOCKET_PORT}`);

socket.onopen = () => {
  console.log('Socket ready...');
}

socket.onmessage = ({ data }) => {
  let action = JSON.parse(data);

  switch (action.type) {
    case USER_CONNECTED:
      store.dispatch({
          type: START_APP,
          payload: {
            activeUser: action.payload.activeUser,
            users: action.payload.users,
            messages: action.payload.messages,
          },
        }
      )
      break;

    case USER_LIST_UPDATED:
      store.dispatch({
          type: UPDATE_USER_LIST,
          payload: {
            users: action.payload.users,
          },
        }
      )
      break;

    case MESSAGE_RECEIVED:
      store.dispatch({
        type: UPDATE_MESSAGE_LIST,
        payload: {
          messages: action.payload.messages,
        },
      })
      break;

    case MESSAGE_LIST_UPDATED:
      store.dispatch({
        type: UPDATE_MESSAGE_LIST,
        payload: {
          messages: action.payload.messages,
        },
      })
      break;

    default:
      console.log('Unknown action: ', action);
  }
}

socket.onerror = () => {
  alert('Socket error!');
}

export default socket;
