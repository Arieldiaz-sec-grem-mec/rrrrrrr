// Importamos Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase (Reemplaza con tu configuración)
const firebaseConfig = {
    apiKey: "AIzaSyCXEwoa0IIHcxu5AYbNyb7jwT-b3z2quOM",
    authDomain: "react-modelo.firebaseapp.com",
    projectId: "react-modelo",
    storageBucket: "react-modelo.firebasestorage.app",
    messagingSenderId: "69578220102",
    appId: "1:69578220102:web:bf43bd6a36b80cbfe66047"
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
