const firebaseConfig = {
  apiKey: "AIzaSyBLifu6aMep1M-gF7xYG8szluUI92144Jo",
  authDomain: "accessible-web-f5072.firebaseapp.com",
  projectId: "accessible-web-f5072",
  storageBucket: "accessible-web-f5072.firebasestorage.app",
  messagingSenderId: "192440184688",
  appId: "1:192440184688:web:e55d4d2b7d5b0f42b669b5",
  measurementId: "G-8H0403FTWX",
};

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
