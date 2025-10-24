const socket = io();
let username = '';

const loginDiv = document.getElementById('login');
const chatDiv = document.getElementById('chat');
const startBtn = document.getElementById('startChat');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('send');
const messages = document.getElementById('messages');

startBtn.onclick = () => {
  const input = document.getElementById('username');
  if (input.value.trim()) {
    username = input.value.trim();
    socket.emit('user joined', username);
    loginDiv.style.display = 'none';
    chatDiv.style.display = 'block';
  }
};

sendBtn.onclick = () => {
  const text = messageInput.value.trim();
  if (text) {
    socket.emit('chat message', { username, text });
    messageInput.value = '';
  }
};

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendBtn.click();
});

socket.on('chat message', (data) => {
  const msg = document.createElement('div');
  msg.classList.add('message');

  if (data.username === username) {
    msg.classList.add('mine');
  } else {
    msg.classList.add('other');
  }

  msg.innerHTML = `
    <strong>${data.username}</strong>: ${data.text}
    <span class="time">${data.time}</span>
  `;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
});

socket.on('system message', (text) => {
  const msg = document.createElement('div');
  msg.classList.add('message', 'system');
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
});
