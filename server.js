const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static('public'));
io.on('connection', (socket) => {
  socket.on('user joined', (username) => {
    socket.username = username;
    console.log(`${username} вошёл в чат`);
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    io.emit('system message', `${username} вошёл в чат (${time})`);
  });
  socket.on('chat message', (data) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    io.emit('chat message', { ...data, time });
  });
  socket.on('disconnect', () => {
    if (socket.username) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      console.log(`${socket.username} вышел из чата`);
      io.emit('system message', `${socket.username} вышел из чата (${time})`);
    }
  });
});
server.listen(3000, () => {
  console.log('✅ Сервер запущен: http://localhost:3000');
});
