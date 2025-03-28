import React, { useState } from "react";
import { auth, db } from "../../firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./Auth.css";

function AuthForm({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [view, setView] = useState("login");
  const [error, setError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResetSuccess(false);

    try {
      if (view === "login") {
        const result = await signInWithEmailAndPassword(auth, email, password);
        if (onLoginSuccess) onLoginSuccess(result.user);
      } else if (view === "register") {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        
        await updateProfile(result.user, {
          displayName: `${nombre} ${apellido}`
        });

        await setDoc(doc(db, "users", result.user.uid), {
          nombre,
          apellido,
          email,
          role: "Usuario",
          createdAt: new Date().toISOString()
        });

        if (onLoginSuccess) onLoginSuccess(result.user);
      } else if (view === "reset") {
        if (!email) {
          throw new Error("Por favor, ingresa tu correo electrónico");
        }
        await sendPasswordResetEmail(auth, email, {
          url: window.location.origin + '/login', // URL de redirección después de resetear
        });
        setResetSuccess(true);
        setEmail(""); // Limpiar el campo de email después del éxito
      }
    } catch (err) {
      let errorMessage = "Ocurrió un error";
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = "No existe una cuenta con este correo electrónico";
          break;
        case 'auth/wrong-password':
          errorMessage = "Contraseña incorrecta";
          break;
        case 'auth/invalid-email':
          errorMessage = "Correo electrónico inválido";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Demasiados intentos fallidos. Por favor, intenta más tarde";
          break;
        default:
          errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>{view === "login" ? "Iniciar Sesión" : view === "register" ? "Registro" : "Recuperar Contraseña"}</h2>
      {error && <p className="error">{error}</p>}
      {resetSuccess && view === "reset" && (
        <p className="success">
          Se ha enviado un enlace de recuperación a tu correo electrónico. 
          Por favor, revisa tu bandeja de entrada y sigue las instrucciones.
        </p>
      )}

      <form onSubmit={handleAuth}>
        {view === "register" && (
          <>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
          </>
        )}
        <input 
          type="email" 
          placeholder="Correo electrónico" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        {view !== "reset" && (
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Procesando..." : 
           view === "login" ? "Iniciar Sesión" : 
           view === "register" ? "Registrarse" : 
           "Enviar enlace de recuperación"}
        </button>
      </form>

      <div className="switch">
        {view === "login" && (
          <>
            <p onClick={() => setView("register")}>¿No tienes cuenta? Regístrate</p>
            <p onClick={() => { setView("reset"); setError(""); setResetSuccess(false); }}>
              ¿Olvidaste tu contraseña?
            </p>
          </>
        )}
        {view === "register" && <p onClick={() => setView("login")}>¿Ya tienes cuenta? Inicia sesión</p>}
        {view === "reset" && <p onClick={() => setView("login")}>Volver al inicio de sesión</p>}
      </div>
    </div>
  );
}

export default AuthForm;