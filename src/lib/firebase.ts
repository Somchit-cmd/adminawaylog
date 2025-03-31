import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCNk9KPd_QQtJURp8iFPrZKeex56K1N5_A",
  authDomain: "admin-away-log.firebaseapp.com",
  projectId: "admin-away-log",
  storageBucket: "admin-away-log.firebasestorage.app",
  messagingSenderId: "418840841692",
  appId: "1:418840841692:web:433c98841258d985735319",
  measurementId: "G-VLWLXRYMSK"
};

// Log the configuration (remove in production)
console.log('Firebase Config:', {
  ...firebaseConfig,
  apiKey: '***' // Hide the actual API key in logs
});

let app;
let auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut }; 