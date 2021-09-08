// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcF5OuDn_KArUfWVXXndHCoKWo_ZwRdlA",
  authDomain: "principal33-frontend-cms.firebaseapp.com",
  projectId: "principal33-frontend-cms",
  storageBucket: "principal33-frontend-cms.appspot.com",
  messagingSenderId: "150929172953",
  appId: "1:150929172953:web:2749b7d4e2133309d311c8",
  measurementId: "G-083WQ0SSV8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);