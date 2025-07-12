// Kullanıcı adını URL parametresinden al
function getUsernameFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('user') || '';
}

const username = getUsernameFromUrl();
const userInfo = document.getElementById('user-info');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const userList = document.getElementById('user-list');
const userCount = document.getElementById('user-count');
const typingIndicator = document.getElementById('typing-indicator');

let typingTimeout = null;
function showTypingIndicator() {
  typingIndicator.innerHTML = `${username} yazıyor <span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
  if (typingTimeout) clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    typingIndicator.innerHTML = '';
  }, 1500);
}
messageInput.addEventListener('input', showTypingIndicator);

if (!username) {
  // Kullanıcı adı yoksa ana sayfaya yönlendir
  window.location.href = 'index.html';
}

userInfo.textContent = `👤 ${username}`;

// Kullanıcıyı localStorage'da tut
function getUserList() {
  try {
    return JSON.parse(localStorage.getItem('chat_users') || '[]');
  } catch {
    return [];
  }
}
function setUserList(list) {
  localStorage.setItem('chat_users', JSON.stringify(list));
}
function addUserToList(name) {
  let list = getUserList();
  if (!list.includes(name)) {
    list.push(name);
    setUserList(list);
  }
}
function removeUserFromList(name) {
  let list = getUserList();
  list = list.filter(u => u !== name);
  setUserList(list);
}
function renderUserList() {
  const list = getUserList();
  userList.innerHTML = '';
  list.forEach(u => {
    const li = document.createElement('li');
    li.innerHTML = `👤 <span>${u}</span>`;
    userList.appendChild(li);
  });
  userCount.textContent = list.length;
}

// Kullanıcıyı ekle ve listeyi güncelle
addUserToList(username);
renderUserList();

// Farklı sekmelerde güncel tutmak için
window.addEventListener('storage', function(e) {
  if (e.key === 'chat_users') renderUserList();
});

// Sekme kapanınca kullanıcıyı çıkar
window.addEventListener('beforeunload', function() {
  removeUserFromList(username);
});

const emojiBtn = document.getElementById('emoji-btn');
const emojiPanel = document.getElementById('emoji-panel');

const EMOJIS = [
  '😀','😁','😂','🤣','😊','😍','😘','😎','😜','🤩','🥳','😇','😏','😢','😭','😡','😱','👍','👏','🙏','🔥','💯','🎉','🥰','😅','😉','😋','😐','😶','😴','🤔','🙄','😬','😌','😃','😆','😝','😤','😔','😕','🙃','😲','😳','🥲','🤗','🤭','😺','😻','😽','🙀','💩','👻','🤖','🎶','❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','💕','💞','💓','💗','💖','💘','💝','💟','❣️','💤','💢','💥','💦','💨','🕊️','🌈','☀️','🌙','⭐','⚡','🌟','☁️','🍀','🌸','🌹','🌻','🌼','🌺','🌵','🌴','🌳','🌲','🌱','🍁','🍂','🍃','🍄','🌾','🌽','🍇','🍉','🍊','🍋','🍌','🍍','🥭','🍎','🍏','🍐','🍑','🍒','🍓','🥝','🥥','🥑','🍆','🥔','🥕','🌶️','🥒','🥬','🥦','🧄','🧅','🍄','🥜','🌰','🍞','🥐','🥖','🥨','🥯','🥞','🧇','🧀','🍖','🍗','🥩','🥓','🍔','🍟','🍕','🌭','🥪','🌮','🌯','🥙','🧆','🥚','🍳','🥘','🍲','🥣','🥗','🍿','🧈','🧂','🥫','🍱','🍘','🍙','🍚','🍛','🍜','🍝','🍠','🍢','🍣','🍤','🍥','🥮','🍡','🥟','🥠','🥡','🦪','🍦','🍧','🍨','🍩','🍪','🎂','🍰','🧁','🥧','🍫','🍬','🍭','🍮','🍯','🍼','🥛','☕','🍵','🧃','🥤','🍶','🍺','🍻','🥂','🍷','🥃','🍸','🍹','🍾','🥄','🍴','🍽️','🥣','🥡','🥢','🧂'
];

// Sayfa açılır açılmaz paneli hazırla
renderEmojiPanel();

function getRecentEmojis() {
  try {
    return JSON.parse(localStorage.getItem('recent_emojis') || '[]');
  } catch { return []; }
}
function setRecentEmojis(arr) {
  localStorage.setItem('recent_emojis', JSON.stringify(arr.slice(0, 12)));
}

function renderEmojiPanel(filter = '') {
  // Son kullanılanlar
  const recentDiv = document.getElementById('recent-emojis');
  const emojiListDiv = document.getElementById('emoji-list');
  recentDiv.innerHTML = '';
  emojiListDiv.innerHTML = '';
  const recent = getRecentEmojis();
  if (recent.length > 0) {
    recent.forEach(e => {
      const span = document.createElement('span');
      span.textContent = e;
      span.title = 'Son kullanılan';
      span.addEventListener('click', () => {
        messageInput.value += e;
        messageInput.focus();
        emojiPanel.classList.remove('open');
        // Son kullanılanlara ekle
        updateRecentEmojis(e);
        renderEmojiPanel(document.getElementById('emoji-search').value);
      });
      recentDiv.appendChild(span);
    });
  }
  // Arama
  const search = filter.trim().toLowerCase();
  let emojis = EMOJIS;
  if (search) {
    emojis = EMOJIS.filter(e => {
      // Unicode isimle arama yok, sadece karaktere göre filtre (isteğe göre genişletilebilir)
      return e.includes(search);
    });
  }
  emojis.slice(0, 60).forEach(e => {
    // Son kullanılanlarda gösterme
    if (recent.includes(e)) return;
    const span = document.createElement('span');
    span.textContent = e;
    span.addEventListener('click', () => {
      messageInput.value += e;
      messageInput.focus();
      emojiPanel.classList.remove('open');
      updateRecentEmojis(e);
      renderEmojiPanel(document.getElementById('emoji-search').value);
    });
    emojiListDiv.appendChild(span);
  });
}

function updateRecentEmojis(emoji) {
  let arr = getRecentEmojis();
  arr = arr.filter(e => e !== emoji);
  arr.unshift(emoji);
  setRecentEmojis(arr);
}

// Arama kutusu event
setTimeout(() => {
  const searchInput = document.getElementById('emoji-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderEmojiPanel(e.target.value);
    });
  }
}, 200);


emojiBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  emojiPanel.classList.toggle('open');
});

// Panel dışında bir yere tıklanırsa kapat
window.addEventListener('click', (e) => {
  if (!emojiPanel.contains(e.target) && e.target !== emojiBtn) {
    emojiPanel.classList.remove('open');
  }
});

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

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') sendMessage();
});

// Basit Türkçe küfür/argo listesi (dilediğin gibi genişletebilirsin)
const BAD_WORDS = [
  'amk', 'aq', 'orospu', 'piç', 'sik', 'yarrak', 'ananı', 'anan', 'amına', 'amcık', 'göt', 'mal', 'salak', 'gerizekalı', 'aptal', 'sürtük', 'pezevenk', 'kahpe', 'ibne', 'döl', 'sikik', 'mk', 'sg', 'puşt', 'yavşak', 'şerefsiz', 'oç'
];

function containsBadWord(text) {
  const normalized = text.toLowerCase().replace(/[^a-zçğıöşü0-9\s]/gi, '');
  return BAD_WORDS.some(word => normalized.includes(word));
}

function getBadWordCount() {
  return parseInt(localStorage.getItem('bad_word_count_' + username) || '0', 10);
}
function setBadWordCount(count) {
  localStorage.setItem('bad_word_count_' + username, count);
}

function sendMessage() {
  const msg = messageInput.value.trim();
  if (msg.length === 0) return;

  // Küfür kontrolü
  if (containsBadWord(msg)) {
    let count = getBadWordCount() + 1;
    setBadWordCount(count);
    // Sohbet ekranına sistem mesajı ekle
    addSystemMessage(`${username} küfürlü mesaj göndermeye çalıştı! Lütfen argo ve küfürlü konuşmayın.`);
    alert('Lütfen argo ve küfürlü konuşmayın! (' + count + '/3)');
    if (count >= 3) {
      localStorage.setItem('banned', '1');
      setBadWordCount(0);
      window.location.href = 'index.html';
      return;
    }
    return;
  }

  addMessage(username, msg, true);
  messageInput.value = '';
  messageInput.focus();
}

function addSystemMessage(text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'system-message';
  msgDiv.textContent = text;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}


// Sohbet sayfasından çıkınca sayacı sıfırla
window.addEventListener('beforeunload', function() {
  setBadWordCount(0);
  removeUserFromList(username);
});

function addMessage(user, text, isMe) {
  const msgDiv = document.createElement('div');
  msgDiv.className = isMe ? 'my-message' : 'other-message';
  // Zaman damgası
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const timeStr = `${hh}:${mm}`;
  msgDiv.innerHTML = `<b>${user}:</b> ${text} <span class="msg-time">${timeStr}</span>`;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
