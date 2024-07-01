import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore,collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOXToxmBYxQJQYr8c-S3NdFKiEMkiGQgg",
  authDomain: "react-notes-5d177.firebaseapp.com",
  projectId: "react-notes-5d177",
  storageBucket: "react-notes-5d177.appspot.com",
  messagingSenderId: "510004320517",
  appId: "1:510004320517:web:3f89c683865e11fbeaff6c",
  measurementId: "G-K0NH9BHKNE"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")