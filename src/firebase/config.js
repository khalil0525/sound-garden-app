// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
console.log(process.env.REACT_APP_FIREBASE_API_KEY);
const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// ************************************************
// YOU ARE CURRENTLY USE WEB VERSION 8 METHODS
// ********************************************
//Object to interact with firestore
const projectFirestore = firebase.firestore();
//Object to interact with firebase auth
const projectAuth = firebase.auth();
//Special data property from firestore to give our documents a timestamp
const timestamp = firebase.firestore.Timestamp;
//Object to interact with firebase storage
const projectStorage = firebase.storage();

export { projectFirestore, projectAuth, projectStorage, timestamp };
