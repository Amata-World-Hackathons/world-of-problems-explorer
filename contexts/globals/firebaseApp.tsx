import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import legacyFirebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore";

export { default as legacyFirebase } from "firebase/compat/app";

const firebaseConfig = {
  apiKey: "AIzaSyA6be2T_ZN4kvJIQFMrCsHypkpT5QemY1M",
  authDomain: "world-of-problems-explorer.firebaseapp.com",
  projectId: "world-of-problems-explorer",
  storageBucket: "world-of-problems-explorer.appspot.com",
  messagingSenderId: "486226266904",
  appId: "1:486226266904:web:b9e88bfe8b80a26bc92c6d",
};

export const firebaseApp =
  typeof window !== "undefined" ? initializeApp(firebaseConfig) : ({} as any);

export const firebaseAuth =
  typeof window !== "undefined" ? getAuth(firebaseApp) : ({} as any);

export const legacyApp =
  typeof window !== "undefined"
    ? legacyFirebase.initializeApp(firebaseConfig)
    : ({} as any);

export const firebaseDb =
  typeof window !== "undefined" ? getFirestore(firebaseApp) : ({} as any);

export default firebaseApp;
