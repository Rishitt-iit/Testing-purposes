# Security Notes

- Password entry (1109) is validated via ASCII code comparison, not stored as literal string.
- Firebase Auth + Firestore rules enforce conversation-level access.
- No admin SDK or service account keys exist inside the APK.
- End-to-End Encryption: Not implemented. Messages are protected by TLS (in transit) and Firestore security rules (at rest access control). True E2EE with Signal Protocol is documented as a future improvement because reliable key management across independent Android installs requires additional native integration.
- The hidden entry is a UI-layer obscurity mechanism only; actual private message security depends on Firebase Authentication and session management.
