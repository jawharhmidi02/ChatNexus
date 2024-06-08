const express = require('express');
const app = express();
const User = require('./routes/user');
const Accounts = require('./routes/account');
const Conversations = require('./routes/conversation');
const Messages = require('./routes/message');
const db = require('./db/connect');
const path = require('path');
const http = require('http'); // Import http module

require('dotenv').config();

// Middleware
app.use(express.static('./public'));
app.use(express.json());

// Routes
app.use('/api/users', User);
app.use('/api/accounts', Accounts);
app.use('/api/conversations', Conversations);
app.use('/api/messages', Messages);
app.use('/uploads', express.static(path.join(__dirname, 'photos')));

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  },
  pingInterval: 10000,
  pingTimeout: 5000
});

const conversations = {};
const users = {};
const activeusers = require("./models/user");
const accounts = require("./models/Account");
const convmodels = require("./models/Conversation");

io.on('connection', socket => {
  socket.on('authenticate', async({username, conversations_id}) => {
    await activeusers.findOneAndUpdate({username}, {isactive: true}, {new: true}).then(res => console.log(res));
    conversations_id.forEach(el => {
      if (conversations[el]) {
        conversations[el].add(username);
      } else {
        conversations[el] = new Set([username]);
      }
    });
    users[username] = socket;
    console.log(`${username} authenticated`);
  });

  socket.on("new_convo", async({conversation_id, members}) => {
    conversations[conversation_id] = new Set();
    console.log(members);
    members.forEach(async el => {
      await accounts.findOneAndUpdate({username: el}, {$push: {conversations: conversation_id}}, {new: true}).then(res => {
        if (users[el]) {
          users[el].emit("new_convo", {conversation_id});
          conversations[conversation_id].add(el);
        }
      });
    });
  });

  socket.on("new_member", async({conversation_id, members}) => {
    if (!conversations[conversation_id]) {
      conversations[conversation_id] = new Set();
    }
    members.forEach(async el => {
      await accounts.findOneAndUpdate({username: el}, {$push: {conversations: conversation_id}}, {new: true}).then(res => {
        if (users[el]) {
          users[el].emit("new_convo", {conversation_id});
          conversations[conversation_id].add(el);
        }
      });
    });
  });

  socket.on("message", ({ username, conversation_id, message, time }) => {
    if (conversations[conversation_id]) {
      for (const user of conversations[conversation_id]) {
        if (user === username) {
          continue;
        }
        users[user].emit("message", { username, conversation_id, message, time });
      }
    }
  });

  socket.on("leave", async({username, conversation_id}) => {
    await accounts.findOneAndUpdate({username}, {$pull: {conversations: conversation_id}}, {new: true}).then(res => console.log(res));
    conversations[conversation_id].delete(username);
    await convmodels.findById(conversation_id).then(res => {
      if (res.members.length === 1) {
        convmodels.findOneAndDelete({_id: conversation_id});
      }
    });
  });

  socket.on("disconnect", async () => {
    const user = Object.keys(users).find(key => users[key] === socket);
    await activeusers.findOneAndUpdate({username: user}, {isactive: false, last_time_active: new Date()}, {new: true}).then(res => console.log(res));
    if (user) {
      Object.keys(conversations).forEach(el => {
        conversations[el].delete(user);
      });
      console.log(`${user} disconnected`);
      delete users[user];
    }
  });
});

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await db(process.env.MONGO_URI);
    server.listen(port, () => console.log(`Server and Socket.IO listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();