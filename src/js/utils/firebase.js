// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6fY5cuIObgYoHN3mBa-z-J1XnNF0oe8c",
  authDomain: "story-app-422d8.firebaseapp.com",
  projectId: "story-app-422d8",
  storageBucket: "story-app-422d8.appspot.com",
  messagingSenderId: "455789412025",
  appId: "1:455789412025:web:d3d52329dfe86ece456568"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
