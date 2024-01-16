// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app")
const { getAuth } = require("firebase/auth")
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRCLh4IDBXf5SFIRi_SOBGDss_jQ-NrRo",
  authDomain: "otp-project-d32ac.firebaseapp.com",
  projectId: "otp-project-d32ac",
  storageBucket: "otp-project-d32ac.appspot.com",
  messagingSenderId: "374942427072",
  appId: "1:374942427072:web:cdf0bbb4d94bdf24b18a25",
  measurementId: "G-7KVEBS0KZZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
exports.module = {auth};