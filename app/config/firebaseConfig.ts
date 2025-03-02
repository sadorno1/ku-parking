import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

//Firebase configuration
const firebaseConfig = {
  apiKey: "a",
  authDomain: "ku-parking.firebaseapp.com",
  projectId: "ku-parking",
  storageBucket: "ku-parking.firebasestorage.app",
  messagingSenderId: "a",
  appId: "a"
};


const firebaseApp = initializeApp(firebaseConfig);
export const db = getDatabase(firebaseApp);
