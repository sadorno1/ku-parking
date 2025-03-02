import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOfKj3P1_Uz0VN5QPsAO6kmMqz6G7jhEQ",
  authDomain: "ku-parking.firebaseapp.com",
  projectId: "ku-parking",
  storageBucket: "ku-parking.firebasestorage.app",
  messagingSenderId: "973149235141",
  appId: "1:973149235141:web:881dee7f8c505c396b4dac"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { db };
