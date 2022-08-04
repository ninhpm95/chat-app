const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const SOCKET_PORT = 3002;

const {
  USER_CONNECTED,
  USER_TYPING,
  USER_LIST_UPDATED,

  MESSAGE_SENT,

  MESSAGE_RECEIVED,
  MESSAGE_LIST_UPDATED,

  CHANGE_USERNAME,
  DELETE_LAST_MESSAGE
} = require('./const/SocketActionTypes');

const server = new WebSocket.Server({ port: SOCKET_PORT });

const users = {};

const messages = {};

const findLastMessageByUserId = (messageArray, userId) => {
  for (let i = messageArray.length - 1; i >= 0; i--) {
    if (messageArray[i].userId === userId) {
      return messageArray[i];
    }
  }
};

server.on('connection', ws => {
  const CurrentId = uuidv4();

  users[CurrentId] = {
    id: CurrentId,
    name: `User-${CurrentId.substring(0, 5)}`,
  };

  broadcastToSelf({
    type: USER_CONNECTED,
    payload: {
      activeUser: users[CurrentId],
      users,
      messages,
    },
  }, ws);

  broadcastToOthers({
    type: USER_LIST_UPDATED,
    payload: {
      users,
    },
  }, ws);

  console.log('User connected');
  console.log('User: ', users[CurrentId]);

  ws.on('message', message => {
    const action = JSON.parse(message);

    switch (action.type) {
      case USER_TYPING: {
        users[action.payload.userId] = {
          ...users[action.payload.userId],
          typing: action.payload.typing,
        };

        broadcastToOthers({
          type: USER_LIST_UPDATED,
          payload: {
            users,
          },
        });

        console.log('User is typing');
        console.log('User: ', users[action.payload.userId]);

        break;
      }

      case MESSAGE_SENT: {
        const NewMessageId = uuidv4();

        messages[NewMessageId] = {
          id: NewMessageId,
          type: action.payload.type,
          count: action.payload.count,
          text: action.payload.text,
          time: action.payload.time,
          userId: action.payload.userId,
        };

        broadcastToSelf({
          type: MESSAGE_RECEIVED,
          payload: {
            message: messages[NewMessageId],
            messages,
          },
        }, ws);

        broadcastToOthers({
          type: MESSAGE_LIST_UPDATED,
          payload: {
            messages,
          },
        }, ws);

        console.log('Message received');
        console.log('Message: ', messages[NewMessageId]);

        break;
      }

      case CHANGE_USERNAME: {
        users[action.payload.userId] = {
          ...users[action.payload.userId],
          name: action.payload.userName,
        };

        broadcastToAll({
          type: USER_LIST_UPDATED,
          payload: {
            users,
          },
        });

        console.log('User name updated');
        console.log('User: ', users[action.payload.userId]);

        break;
      }

      case DELETE_LAST_MESSAGE: {
        const messageArray = Object.keys(messages).map(key => messages[key]);
        const lastMessage = findLastMessageByUserId(messageArray, action.payload.userId);

        if (lastMessage) {
          delete messages[lastMessage.id];

          broadcastToAll({
            type: MESSAGE_LIST_UPDATED,
            payload: {
              messages,
            },
          });

          console.log('Message removed');
          console.log('Message: ', lastMessage);
        }

        break;
      }

      default:
        console.log('Unknown action: ', action);
    }
  })

  ws.on('close', () => {
    delete users[CurrentId];

    broadcastToOthers({
      type: USER_LIST_UPDATED,
      payload: {
        users,
      },
    }, ws);

    console.log('1 user disconnected');
  })
})

const broadcastToSelf = (action, ws) => {
  ws.send(JSON.stringify(action));
};

const broadcastToOthers = (action, ws) => {
  server.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client !== ws) {
      client.send(JSON.stringify(action));
    }
  })
};

const broadcastToAll = action => {
  server.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(action));
    }
  })
};

console.log(`Socket server running on port ${SOCKET_PORT}`);
