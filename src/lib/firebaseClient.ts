import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBUGAMUU7TZ-PFbqtJ1AmYG3VHpGFVljyc",
    authDomain: "examensarbete-377909.firebaseapp.com",
    projectId: "examensarbete-377909",
    storageBucket: "examensarbete-377909.appspot.com",
    messagingSenderId: "902108886050",
    appId: "1:902108886050:web:715ecc5cf36797df1e067b"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig, "firebase");
const db = getFirestore(app);

export { db }