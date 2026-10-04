let auth, db, currentConv = null, msgUnsub = null;

function initFirebase() {
  const cfg = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-app",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "123",
    appId: "1:123:web:abcd"
  };
  firebase.initializeApp(cfg);
  auth = firebase.auth();
  db = firebase.firestore();
  db.enablePersistence().catch(() => {});
}

function exitLove() { window.location.href = 'index.html'; }

async function doAuth() {
  const email = document.getElementById('auth-email').value.trim();
  const pass = document.getElementById('auth-pass').value.trim();
  try {
    await auth.signInWithEmailAndPassword(email, pass);
    showMessenger();
  } catch(e) { alert('Login failed: ' + e.message); }
}

async function doRegister() {
  const email = document.getElementById('auth-email').value.trim();
  const pass = document.getElementById('auth-pass').value.trim();
  try {
    await auth.createUserWithEmailAndPassword(email, pass);
    await db.collection('users').doc(auth.currentUser.uid).set({
      uid: auth.currentUser.uid,
      name: email.split('@')[0],
      searchName: email.split('@')[0].toLowerCase(),
      status: 'online',
      lastActive: firebase.firestore.FieldValue.serverTimestamp()
    });
    showMessenger();
  } catch(e) { alert('Registration error: ' + e.message); }
}

function showMessenger() {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('messenger-panel').style.display = 'flex';
  loadConversations();
  listenPresence();
}

function loadConversations() {
  const uid = auth.currentUser.uid;
  db.collection('conversations').where('participants', 'array-contains', uid)
    .onSnapshot(snap => {
      const list = document.getElementById('conv-list');
      list.innerHTML = '';
      snap.forEach(doc => {
        const d = doc.data();
        const partner = d.participants.find(p => p !== uid);
        const item = document.createElement('div');
        item.className = 'conv-item';
        item.innerHTML = `<img src="assets/icons/user.svg" alt="" /><div><strong>${partner ? partner.substring(0,8) : 'User'}</strong><br><small>${d.lastMessage || ''}</small></div>`;
        item.onclick = () => openConv(doc.id, partner);
        list.appendChild(item);
      });
    });
}

function openConv(convId, partnerId) {
  currentConv = convId;
  document.getElementById('chat-name').textContent = partnerId ? partnerId.substring(0,8) : 'Chat';
  
  if (msgUnsub) msgUnsub();
  msgUnsub = db.collection('conversations').doc(convId).collection('messages')
    .orderBy('timestamp', 'asc').onSnapshot(snap => {
      const box = document.getElementById('msg-box');
      box.innerHTML = '';
      snap.forEach(msg => {
        const d = msg.data();
        const div = document.createElement('div');
        div.className = 'bubble ' + (d.senderId === auth.currentUser.uid ? 'sent' : 'received');
        div.textContent = d.text || '';
        // Simple read receipt: if received, show delivered (simplified)
        box.appendChild(div);
      });
      box.scrollTop = box.scrollHeight;
    });
}

async function sendMsg() {
  const text = document.getElementById('msg-text').value.trim();
  if (!text || !currentConv) return;
  const uid = auth.currentUser.uid;
  const batch = db.batch();
  
  batch.set(db.collection('conversations').doc(currentConv).collection('messages').doc(), {
    senderId: uid,
    text: text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    status: 'sent'
  });
  
  batch.update(db.collection('conversations').doc(currentConv), {
    lastMessage: text,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  
  await batch.commit();
  document.getElementById('msg-text').value = '';
}

function searchUsers(q) {
  if (!q) return;
  db.collection('users').where('searchName', '>=', q.toLowerCase()).where('searchName', '<=', q.toLowerCase() + '\uf8ff').get()
    .then(snap => {
      // For demo: start conversation by creating conversation doc with both UIDs
      // Full implementation would create new conversation if not exists
      console.log('Found users:', snap.size);
    });
}

function listenPresence() {
  auth.currentUser?.getIdTokenResult(true);
  // Simplified: update lastActive on disconnect/interval
}

// Initialize when loaded
initFirebase();
auth.onAuthStateChanged(u => { if (u) showMessenger(); });
