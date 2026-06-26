// Firebase config — значения берутся из переменных окружения Vite.
// Для локальной разработки создай файл .env в корне проекта:
//   VITE_FIREBASE_API_KEY=...
//   VITE_FIREBASE_AUTH_DOMAIN=...
//   VITE_FIREBASE_DATABASE_URL=...
//   VITE_FIREBASE_PROJECT_ID=...
//   VITE_FIREBASE_APP_ID=...
//
// Для Netlify: Site Settings → Environment Variables → добавь те же ключи.
// Создать проект Firebase: https://console.firebase.google.com
//   1. Создать Web App
//   2. Включить Realtime Database (выбрать регион, правила — тестовый режим)
//   3. Скопировать config сюда через .env

export const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY             ?? '',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN         ?? '',
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL        ?? '',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID          ?? '',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET      ?? '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID              ?? '',
}
