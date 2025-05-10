// src/firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBYbRaIyfeNUxcIbiT1VBDoBPLQbD4tyM",
  authDomain: "firechats-57dba.firebaseapp.com",
  projectId: "firechats-57dba",
  storageBucket: "firechats-57dba.firebasestorage.app",
  messagingSenderId: "597688465054",
  appId: "1:597688465054:web:e33202f664acc885482d8f"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
export { db };
