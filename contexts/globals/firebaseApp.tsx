import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import legacyFirebase from "firebase/compat/app";

export { default as legacyFirebase } from "firebase/compat/app";

const firebaseConfig = {
  apiKey: "AIzaSyAZSdMMn9yShaCI7qOFks5nUWbYK7Zg2AE",
  authDomain: "hacks-and-jams.firebaseapp.com",
  projectId: "hacks-and-jams",
  storageBucket: "hacks-and-jams.appspot.com",
  messagingSenderId: "211703648683",
  appId: "1:211703648683:web:563ee55bd85fb2d6ed82ee",
};

export const firebaseApp =
  typeof window !== "undefined" ? initializeApp(firebaseConfig) : ({} as any);

export const firebaseAuth =
  typeof window !== "undefined" ? getAuth(firebaseApp) : ({} as any);

export const legacyApp =
  typeof window !== "undefined"
    ? legacyFirebase.initializeApp(firebaseConfig)
    : ({} as any);

export default firebaseApp;
