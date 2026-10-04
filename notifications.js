function initNotifications() {
  const messaging = firebase.messaging();
  // Request permission
  messaging.requestPermission().then(() => console.log('Notification permission granted'));
  
  // Foreground
  messaging.onMessage(payload => {
    // Always show neutral, generic message (never expose sender/text)
    new Notification('Theme Store', {
      body: 'New wallpaper available — tap to open',
      icon: '/assets/icons/icon-192.png'
    });
  });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('firebase-messaging-sw.js')
    .then(reg => console.log('SW registered'));
}
