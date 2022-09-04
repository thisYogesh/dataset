// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXPC0AXdcZHpfnK2XG-Cao78IOnZ5KwPc",
  authDomain: "dataset-points.firebaseapp.com",
  projectId: "dataset-points",
  storageBucket: "dataset-points.appspot.com",
  messagingSenderId: "1026281531295",
  appId: "1:1026281531295:web:80119af25561541051ffaa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export default {
  app,
  db
}