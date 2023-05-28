import { initializeApp } from "firebase/app";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDT1tFxG4e4oa4_sTFU4r2TvgIYImAVUpg",
  authDomain: "my-workouts-86915.firebaseapp.com",
  projectId: "my-workouts-86915",
  storageBucket: "my-workouts-86915.appspot.com",
  messagingSenderId: "333498183109",
  appId: "1:333498183109:web:e1d6deae75bf6128246fac",
  measurementId: "G-YRLTV0B6DK",
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
  popupRedirectResolver: browserPopupRedirectResolver,
});
export const db = getFirestore(app);
export const facebookProvider = new FacebookAuthProvider();
export const googleProvider = new GoogleAuthProvider();

export default app;
