import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { auth, db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Head from "./components/encabezado/Head";
import AuthForm from "./components/Auth/AuthForm";
import Home from "./components/Vista/Home";
import Perfil from "./components/Vista/Perfil";
import TeacherCourses from "./components/Vista/profesores/TeacherCourses";
import AllUsers from "./components/Vista/administrador/AllUsers";
import "./App.css";
import NuevaClase from './components/Vista/profesores/NuevaClase/NuevaClase';
import ClasesCreadas from './components/Vista/Aula/ClasesCreadas';
import Dashboard from './components/Vista/profesores/AulaVirtual/Dashboard';
import ClasesList from './components/Vista/profesores/AulaVirtual/ClasesList';

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const userData = userDoc.data();
        setUser(currentUser);
        setUserRole(userData?.role);
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return (
      <div className="App">
        <Head />
        <AuthForm onLoginSuccess={(user) => setUser(user)} />
      </div>
    );
  }

  return (
    <div className="App">
      <Head />
      <div className="content-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route 
            path="/mis-cursos" 
            element={
              userRole !== 'Estudiante' ? (
                <TeacherCourses />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/curso/:cursoId/dashboard" 
            element={
              userRole !== 'Estudiante' ? (
                <Dashboard />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/mis-clases" 
            element={
              userRole !== 'Estudiante' ? (
                <ClasesCreadas />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/usuarios" 
            element={
              userRole === 'Administrador' ? (
                <AllUsers />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route path="/curso/:cursoId/nueva-clase" element={<NuevaClase />} />
          {/* Add the new route here, inside the Routes component */}
          <Route 
            path="/curso/:cursoId/clases" 
            element={
              userRole !== 'Estudiante' ? (
                <ClasesList />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
