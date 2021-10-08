// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore  } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_g3lAfbtSiVpkxopxf0ddky_4LZcf36Y",
  authDomain: "tryonexx.firebaseapp.com",
  projectId: "tryonexx",
  storageBucket: "tryonexx.appspot.com",
  messagingSenderId: "741861396997",
  appId: "1:741861396997:web:3cef48ddb2ed18d216026c",
  measurementId: "G-8PHGQE2LC3"
};
export const app = initializeApp(firebaseConfig);
export const db = getFirestore()
