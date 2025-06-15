// auth.js (com redirecionamento para home.html)
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { db } from './firebase-config.js';

const auth = getAuth();

function exibirMensagem(msg, tipo = "info", tempo = 3000) {
  let el = document.getElementById("mensagem");
  if (el) {
    el.innerText = msg;
    el.style.color = tipo === "erro" ? "red" : "lime";
    el.style.fontWeight = "bold";

    if (tempo > 0) {
      setTimeout(() => {
        el.innerText = "";
      }, tempo);
    }
  } else {
    console.log(msg);
  }
}

async function register(email, password) {
  if (!email || !password) {
    exibirMensagem("Preencha todos os campos.", "erro");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "usuarios", user.uid), {
      email: user.email,
      uid: user.uid,
      criadoEm: new Date().toISOString()
    });

    exibirMensagem("Usuário registrado com sucesso.");

    setTimeout(() => {
      window.location.href = "home.html";  // <-- Redirecionamento ajustado aqui
    }, 1500);

  } catch (error) {
    switch (error.code) {
      case "auth/email-already-in-use":
        exibirMensagem("Erro: O email já está em uso.", "erro");
        break;
      case "auth/invalid-email":
        exibirMensagem("Erro: Email inválido.", "erro");
        break;
      case "auth/weak-password":
        exibirMensagem("Erro: A senha deve ter pelo menos 6 caracteres.", "erro");
        break;
      default:
        exibirMensagem("Erro ao registrar: " + error.message, "erro");
    }
  }
}

async function login(email, password) {
  if (!email || !password) {
    exibirMensagem("Preencha todos os campos para login.", "erro");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    exibirMensagem("Login realizado com sucesso.");

    setTimeout(() => {
      window.location.href = "home.html";  // <-- Redirecionamento ajustado aqui
    }, 1500);

  } catch (error) {
    switch (error.code) {
      case "auth/user-not-found":
        exibirMensagem("Usuário não encontrado.", "erro");
        break;
      case "auth/wrong-password":
        exibirMensagem("Senha incorreta.", "erro");
        break;
      case "auth/invalid-email":
        exibirMensagem("Email inválido.", "erro");
        break;
      default:
        exibirMensagem("Erro ao fazer login: " + error.message, "erro");
    }
  }
}

export { register, login };