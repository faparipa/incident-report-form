// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCY1hmZzxGj92qWbSrA0GxmRvUJnO8QDuA',
  authDomain: 'border-incident-tracker.firebaseapp.com',
  projectId: 'border-incident-tracker',
  storageBucket: 'border-incident-tracker.firebasestorage.app',
  messagingSenderId: '859880533519',
  appId: '1:859880533519:web:3194a627cdfadf17aa7d7a',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Adatbázis exportálása
export const db = getFirestore(app);
