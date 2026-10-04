# Privacy

- We collect only authentication info (email) and message content (stored in Firestore) required for messaging.
- Notifications are deliberately neutral and never reveal sender or content.
- Session auto-locks after 5 minutes of inactivity.
- Recent-apps preview can be hidden via `FLAG_SECURE`.
- No contacts, location, microphone, or camera access is requested.
- Users may request account deletion via Firebase Auth delete API.
