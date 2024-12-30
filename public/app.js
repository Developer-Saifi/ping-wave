const socket = io();
let username = localStorage.getItem('username');

// Handle login
document.getElementById('loginBtn').addEventListener('click', function () {
  const inputUsername = document.getElementById('usernameInput').value.trim();
  if (inputUsername) {
    username = inputUsername;
    localStorage.setItem('username', username);
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('chatRoom').style.display = 'block';
    socket.emit('join', username);
  }
});

// Handle sending messages
document.getElementById('sendBtn').addEventListener('click', sendMessage);
document.getElementById('chatInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const message = document.getElementById('chatInput').value.trim();
  if (message) {
    const time = new Date().toLocaleTimeString();
    const chatData = { username, message, time };
    socket.emit('chatMessage', chatData);
    document.getElementById('chatInput').value = ''; // Clear input
  }
}

// Receive messages
socket.on('chatMessage', function (data) {
  const chatMessages = document.getElementById('chatMessages');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.innerHTML = `
    <span class="username">${data.username} : </span> <span class="text">${data.message}</span> <span class="time">(${data.time})</span><br>

  `;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Load chat history for new users
socket.on('loadChatHistory', function (history) {
  const chatMessages = document.getElementById('chatMessages');
  history.forEach(data => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `
      <span class="username">${data.username} : </span> <span class="text">${data.message}</span> <span class="time">(${data.time})</span><br>

    `;
    chatMessages.appendChild(messageElement);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', function () {
  localStorage.removeItem('username');
  window.location.reload();
});

// Handle clear all messages
document.getElementById('clearBtn').addEventListener('click', function () {
  document.getElementById('chatMessages').innerHTML = '';
  socket.emit('clearMessages');
});

// Socket.io events for clearing messages (optional for server-side)
socket.on('clearMessages', function () {
  document.getElementById('chatMessages').innerHTML = '';
});
