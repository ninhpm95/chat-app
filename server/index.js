const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./models/user');
const Message = require('./models/message');

const SOCKET_PORT = 3002;

const {
  USER_CONNECTED,
  USER_TYPING,
  USER_LIST_UPDATED,

  MESSAGE_SENT,

  MESSAGE_RECEIVED,
  MESSAGE_LIST_UPDATED,

  CHANGE_USERNAME
} = require('./const/SocketActionTypes');

let mongodbUri = 'mongodb+srv://testuser:P%40ssword@cluster0.yqfofiw.mongodb.net/chat-app?retryWrites=true&w=majority';

const wss = new WebSocket.Server({ port: SOCKET_PORT });

let users = [];

let messages = [];

let connectToDB = async () => {
  try {
    await mongoose.connect(mongodbUri);
    console.log("DB connected!");
  } catch (err) {
    console.log(err);
  }
}

let getAllUsers = async () => {
  try {
    let users = await User.find({}, { id: 1, name: 1, typing: 1, _id:0 });
    console.log('User list received!');
    console.log(users);
    return users;
  } catch (err) {
    console.log(err);
  }
}

let getAllMessages = async () => {
  try {
    let messages = await Message.find({}, { id: 1, text: 1, time: 1, userId: 1, _id:0 });
    return messages;
  } catch (err) {
    console.log(err);
  }
}

let addUser = async (user) => {
  try {
    const newUser = await user.save();
    console.log('New user added!');
    console.log(newUser);
    return newUser;
  } catch (err) {
    console.log(err);
  }
}

let generateHashedPw = async (pw) => {
  try {
    const hashedPw = await bcrypt.hash(pw, 10);
    return hashedPw;
  } catch (err) {
    console.log(err);
  }
}

let addMessage = async (message) => {
  try {
    const newMessage = await message.save();
    console.log('New message added!');
    console.log(newMessage);
    return newMessage;
  } catch (err) {
    console.log(err);
  }
}

wss.on('connection', async (ws) => {
  await connectToDB();

  const CurrentId = uuidv4();
  let tempPassword = 'P@ssword';
  let password = await generateHashedPw(tempPassword);

  const newUser = new User({
    id: CurrentId,
    password,
    email: `User-${CurrentId.substring(0, 5)}@ninh.com`,
    name: `User-${CurrentId.substring(0, 5)}`
  });

  await addUser(newUser);

  users = await getAllUsers();
  messages = await getAllMessages();

  broadcastToSelf({
    type: USER_CONNECTED,
    payload: {
      activeUser: { id: newUser.id, name: newUser.name },
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

  ws.on('message', async (message) => {
    const action = JSON.parse(message);

    switch (action.type) {
      case USER_TYPING: {
        await User.updateOne({ id: action.payload.userId }, { $set: { typing: action.payload.typing } });
        users = await getAllUsers();
        // let userIndex = users.findIndex(user => user.userId === action.payload.userId);
        // users[userIndex] = { ...users[userIndex], typing: action.payload.typing };
        broadcastToAll({
          type: USER_LIST_UPDATED,
          payload: {
            users,
          },
        });

        console.log('User is typing');

        break;
      }

      case MESSAGE_SENT: {
        const NewMessageId = uuidv4();

        let newMessage = new Message({
          id: NewMessageId,
          text: action.payload.text,
          time: action.payload.time,
          userId: action.payload.userId
        });

        await addMessage(newMessage);
        messages = await getAllMessages();

        broadcastToSelf({
          type: MESSAGE_RECEIVED,
          payload: {
            message: newMessage,
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

        break;
      }

      case CHANGE_USERNAME: {
        await User.updateOne({ id: action.payload.userId }, { $set: { name: action.payload.userName } });
        users = await getAllUsers();

        broadcastToAll({
          type: USER_LIST_UPDATED,
          payload: {
            users,
          },
        });

        console.log('User name updated');

        break;
      }

      default:
        console.log('Unknown action: ', action);
    }
  })

  ws.on('close', async () => {
    await User.deleteOne({ id: CurrentId });
    users = await getAllUsers();

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
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client !== ws) {
      client.send(JSON.stringify(action));
    }
  })
};

const broadcastToAll = action => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(action));
    }
  })
};

console.log(`Socket server running on port ${SOCKET_PORT}`);
