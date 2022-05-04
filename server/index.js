const WebSocket = require('ws');
const R = require('ramda');
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
} = require('./const/SocketActionTypes')

const server = new WebSocket.Server({ port: SOCKET_PORT })

const users = {}

const messages = {}

const findLastMessageByUserId = (messagesArray, userId) => (
  R.findLast(R.propEq('userId', userId))(messagesArray)
)

server.on('connection', ws => {
  const CurrentId = uuidv4();

  users[CurrentId] = {
    id: CurrentId,
    name: `User-${CurrentId.substring(0, 5)}`,
  }

  broadcastToSelf({
    type: USER_CONNECTED,
    payload: {
      activeUser: users[CurrentId],
      users,
      messages,
    },
  }, ws)

  broadcastToOthers({
    type: USER_LIST_UPDATED,
    payload: {
      users,
    },
  }, ws)

  console.log('User Connected')
  console.log('User:', users[CurrentId])
  console.log('Users:', users)

  ws.on('message', message => {
    const action = JSON.parse(message)

    switch (action.type) {
      case USER_TYPING: {
        users[action.payload.userId] = {
          ...users[action.payload.userId],
          typing: action.payload.typing,
        }

        broadcastToOthers({
          type: USER_LIST_UPDATED,
          payload: {
            users,
          },
        })

        console.log('User Typing')
        console.log('User:', users[action.payload.userId])
        console.log('Users:', users)

        break
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
        }

        broadcastToSelf({
          type: MESSAGE_RECEIVED,
          payload: {
            message: messages[NewMessageId],
            messages,
          },
        }, ws)

        broadcastToOthers({
          type: MESSAGE_LIST_UPDATED,
          payload: {
            messages,
          },
        }, ws)

        console.log('Message Received')
        console.log('Message:', messages[NewMessageId])
        console.log('Messages:', messages)

        break
      }

      case CHANGE_USERNAME: {
        users[action.payload.userId] = {
          ...users[action.payload.userId],
          name: action.payload.userName,
        }

        broadcastToAll({
          type: USER_LIST_UPDATED,
          payload: {
            users,
          },
        })

        console.log('User Name Updated')
        console.log('User:', users[action.payload.userId])
        console.log('Users:', users)

        break
      }

      case DELETE_LAST_MESSAGE: {
        const messagesArray = Object.keys(messages).map(key => messages[key])
        const lastMessage = findLastMessageByUserId(messagesArray, action.payload.userId)

        if (lastMessage) {
          delete messages[lastMessage.id]

          broadcastToAll({
            type: MESSAGE_LIST_UPDATED,
            payload: {
              messages,
            },
          })

          console.log('Message Removed')
          console.log('Message:', lastMessage)
          console.log('Messages:', messages)
        }

        break
      }

      default:
        console.log('Unknown action:', action)
    }
  })

  ws.on('close', () => {
    delete users[CurrentId]

    broadcastToOthers({
      type: USER_LIST_UPDATED,
      payload: {
        users,
      },
    }, ws)

    console.log('User Disconnected')
    console.log('Users:', users)
  })
})

const broadcastToSelf = (action, ws) => {
  ws.send(JSON.stringify(action))
}

const broadcastToOthers = (action, ws) => {
  server.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client !== ws) {
      client.send(JSON.stringify(action))
    }
  })
}

const broadcastToAll = action => {
  server.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(action))
    }
  })
}

console.log(`Socket server running on port ${SOCKET_PORT}`)
