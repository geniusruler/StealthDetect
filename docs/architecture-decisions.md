### [2025-11-01] Database Architecture

Context:
- Expo allows Web/iOS/Android builds
- SQLite (expo-sqlite) vs Supabase (cloud)

Decision (tentative):
- Use encrypted local SQLite for scan history, duress PIN, and logs
- Backend (Firestore) used only to pull updated IOC lists
- Cloud sync of user data is unsafe because attacker may see network activity

Next Steps:
- Implement expo-sqlite wrapper in feature/sqlite-db branch

---

