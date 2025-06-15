// firebase-config.js (padronizado para todos os arquivos)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMWxGtooYe7UXzFop_FfCKu-M4ima5vMc",
  authDomain: "hospedagem-rpg.firebaseapp.com",
  databaseURL: "https://hospedagem-rpg-default-rtdb.firebaseio.com",
  projectId: "hospedagem-rpg",
  storageBucket: "hospedagem-rpg.appspot.com",
  messagingSenderId: "834126719159",
  appId: "1:834126719159:web:f605f39f967f9bd2498532",
  measurementId: "G-41LQB57W3X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };