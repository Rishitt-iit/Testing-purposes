importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize with your public config
firebase.initializeApp({ apiKey: "...", projectId: "..." });
const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  self.registration.showNotification('Theme Store', {
    body: 'New wallpaper available — tap to open',
    icon: '/assets/icons/icon-192.png',
    tag: 'theme-store-private'
  });
});
