// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { firestore } from "firebase/firestore";
import { auth } from "firebase/auth";
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
initializeApp(firebaseConfig);

const projectFirestore = firestore();
const projectAuth = auth();

export { projectFirestore, projectAuth };
