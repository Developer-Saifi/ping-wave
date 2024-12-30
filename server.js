const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Store chat messages
let chatHistory = [];

app.use(express.static('public')); // Serve static files

io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Send chat history to the newly connected user
  socket.emit('loadChatHistory', chatHistory);

  // Handle user joining
  socket.on('join', (username) => {
    socket.username = username;
    console.log(`${username} has joined the chat`);
  });

  // Handle receiving a new chat message
  socket.on('chatMessage', (data) => {
    // Add the new message to chat history
    chatHistory.push(data);
    
    // Emit the new message to all users
    io.emit('chatMessage', data);
  });

  // Handle clear messages
  socket.on('clearMessages', () => {
    chatHistory = []; // Clear chat history
    io.emit('clearMessages');
  });

  socket.on('disconnect', () => {
    console.log(`${socket.username} has disconnected`);
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
