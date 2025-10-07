import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCIuer_19dlkAqwYRqbn91uRfBdltvDOzg",
  authDomain: "envision-e137f.firebaseapp.com",
  databaseURL: "https://envision-e137f-default-rtdb.firebaseio.com",
  projectId: "envision-e137f",
  storageBucket: "envision-e137f.firebasestorage.app",
  messagingSenderId: "1002643725547",
  appId: "1:1002643725547:web:924e7466956e1df2fab2ae",
  measurementId: "G-XYDZE80NL8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
