import "./Head.css";
import MenuButton from "./MenuButton";
import Usuario from "./Usuario";
import { auth, db } from "../../firebaseConfig";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";

function Head() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const { displayName, email } = currentUser;
        
        // Obtener datos del usuario desde Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const userData = userDoc.data();
        
        setUser({
          displayName,
          email,
          role: userData?.role || 'Usuario'
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <header className="head-container">
      <div className="logo">
        <img src="/logo.png" alt="Logo del sindicato" />
      </div>
      <div className="title">
        <h1>Sindicato de Choferes de Camiones</h1>
        <h2>Secretaría de Capacitación</h2>
      </div>
      <div className="header-right">
        {user && <Usuario user={user} />}
        <MenuButton userRole={user?.role} />
      </div>
    </header>
  );
}

export default Head;
