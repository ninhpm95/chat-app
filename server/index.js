const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./models/user');
const Message = require('./models/message');

const {
  USER_CONNECTED,
  USER_TYPING,
  USER_LIST_UPDATED,

  MESSAGE_SENT,

  MESSAGE_RECEIVED,
  MESSAGE_LIST_UPDATED,

  CHANGE_USERNAME
} = require('./const/SocketActionTypes');

require('dotenv').config();

const SOCKET_PORT = process.env.SOCKET_PORT;
const MONGODBURI = process.env.MONGODBURI;

// URI to MongoDB Atlas
let mongodbUri = MONGODBURI;

const wss = new WebSocket.Server({ port: SOCKET_PORT });

// User list
let users = [];

// Message list
let messages = [];

// Connect to database
let connectToDB = async () => {
  try {
    await mongoose.connect(mongodbUri);
    console.log("DB connected!");
  } catch (err) {
    console.log(err);
  }
}

// Get all users from database
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

// Get all messages from database
let getAllMessages = async () => {
  try {
    let messages = await Message.find({}, { id: 1, text: 1, time: 1, userId: 1, _id:0 });
    console.log('Message list received!');
    console.log(messages);
    return messages;
  } catch (err) {
    console.log(err);
  }
}

// Add new user to database
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

// Convert plain text password to hashed password
let generateHashedPw = async (pw) => {
  try {
    const hashedPw = await bcrypt.hash(pw, 10);
    return hashedPw;
  } catch (err) {
    console.log(err);
  }
}

// Add new message to database
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

// When user first connects to socket server
wss.on('connection', async (ws) => {
  // Connect to database
  await connectToDB();

  const CurrentId = uuidv4();
  let tempPassword = 'P@ssword';
  // Convert plain text password to hashed password
  let password = await generateHashedPw(tempPassword);

  const newUser = new User({
    id: CurrentId,
    password,
    email: `User-${CurrentId.substring(0, 5)}@ninh.com`,
    name: `User-${CurrentId.substring(0, 5)}`
  });

  // Add new user to database
  await addUser(newUser);
  
  // Get all users and messages
  [users, messages] = await Promise.all([getAllUsers(), getAllMessages()]);

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

  // Handle message received
  ws.on('message', async (message) => {
    const action = JSON.parse(message);

    switch (action.type) {
      // User's typing status is changed: from not typing to typing and vice versa
      case USER_TYPING: {
        // Change user's typing status
        await User.updateOne({ id: action.payload.userId }, { $set: { typing: action.payload.typing } });
        // Get all users after changing user's typing status
        users = await getAllUsers();
        // Send that information to all users
        broadcastToAll({
          type: USER_LIST_UPDATED,
          payload: {
            users,
          },
        });

        console.log('User is typing:', action.payload.userId);
        break;
      }

      // User sends new message
      case MESSAGE_SENT: {
        const NewMessageId = uuidv4();

        let newMessage = new Message({
          id: NewMessageId,
          text: action.payload.text,
          time: action.payload.time,
          userId: action.payload.userId
        });

        // Add message to database
        await addMessage(newMessage);
        // Get all messages
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

        console.log('New message!');
        console.log(newMessage);
        break;
      }

      // User wants to change username
      case CHANGE_USERNAME: {
        // Update user's username
        await User.updateOne({ id: action.payload.userId }, { $set: { name: action.payload.userName } });
        // Get all users
        users = await getAllUsers();

        broadcastToAll({
          type: USER_LIST_UPDATED,
          payload: {
            users,
          },
        });

        console.log('Username updated!');
        console.log('User ID:', action.payload.userId);
        console.log('New username:', action.payload.userName);
        break;
      }

      default:
        console.log('Unknown action: ', action);
    }
  })

  // User closes connection
  ws.on('close', async () => {
    // Delete user from database
    await User.deleteOne({ id: CurrentId });
    // Get all users
    users = await getAllUsers();

    broadcastToOthers({
      type: USER_LIST_UPDATED,
      payload: {
        users,
      },
    }, ws);

    console.log('User disconnected:', CurrentId);
  })
})

// Send data to original user
const broadcastToSelf = (action, ws) => {
  ws.send(JSON.stringify(action));
};

// Send data to other users
const broadcastToOthers = (action, ws) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client !== ws) {
      client.send(JSON.stringify(action));
    }
  })
};

// Send data to all users
const broadcastToAll = action => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(action));
    }
  })
};

console.log(`Socket server running on port ${SOCKET_PORT}`);
