// Banlı kullanıcıya uyarı mesajı göster
const banWarning = document.getElementById('ban-warning');
if (localStorage.getItem('banned') === '1' && banWarning) {
  banWarning.textContent = 'Lütfen argo ve küfürlü konuşmayın!';
  banWarning.style.display = 'block';
  localStorage.removeItem('banned');
}

let username = "";

// Tema geçişi
const themeToggle = document.getElementById('theme-toggle');
function setTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  } else {
    document.body.classList.remove('dark');
    themeToggle.textContent = '🌙';
  }
  localStorage.setItem('chat_theme', theme);
}
function toggleTheme() {
  const current = document.body.classList.contains('dark') ? 'dark' : 'light';
  setTheme(current === 'dark' ? 'light' : 'dark');
}
themeToggle.addEventListener('click', toggleTheme);
// Sayfa açılışında tema ayarla
setTheme(localStorage.getItem('chat_theme') === 'dark' ? 'dark' : 'light');

const loginBox = document.getElementById("login-box");
const chatBox = document.getElementById("chat-box");
const joinBtn = document.getElementById("join-btn");
const usernameInput = document.getElementById("username-input");
const userInfo = document.getElementById("user-info");
const chatMessages = document.getElementById("chat-messages");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const usernameWarning = document.getElementById("username-warning");

joinBtn.addEventListener("click", joinChat);
usernameInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") joinChat();
});

sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") sendMessage();
});

function joinChat() {
  const inputVal = usernameInput.value.trim();
  if (inputVal.length === 0) {
    usernameWarning.textContent = "Lütfen kullanıcı adınızı girin.";
    usernameWarning.style.display = "block";
    loginBox.classList.add("shake");
    setTimeout(() => loginBox.classList.remove("shake"), 400);
    usernameInput.focus();
    return;
  }
  usernameWarning.style.display = "none";
  username = inputVal;
  // Sohbet sayfasına yönlendir, kullanıcı adını parametre olarak aktar
  window.location.href = `chat.html?user=${encodeURIComponent(username)}`;
}

function sendMessage() {
  const msg = messageInput.value.trim();
  if (msg.length === 0) return;
  addMessage(username, msg, true);
  messageInput.value = "";
  messageInput.focus();
}

function addMessage(user, text, isMe) {
  const msgDiv = document.createElement("div");
  msgDiv.className = isMe ? "my-message" : "other-message";
  msgDiv.innerHTML = `<b>${user}:</b> ${text}`;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
