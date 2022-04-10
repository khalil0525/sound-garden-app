// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBP4gyeWEJUUdF1lJ3sM65AAGQY47Jzhfw",
  authDomain: "sound-garden-eeeed.firebaseapp.com",
  projectId: "sound-garden-eeeed",
  storageBucket: "sound-garden-eeeed.appspot.com",
  messagingSenderId: "72509162733",
  appId: "1:72509162733:web:cc616539ac7326515c78e4",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();

export { projectFirestore, projectAuth };
