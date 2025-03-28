import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Home, Users, User, LogOut, BookOpen } from 'lucide-react';
import { auth } from "../../firebaseConfig";
import "./MenuButton.css";

function MenuButton({ userRole }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.reload();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);
  };

  const showTeacherOptions = userRole && userRole !== 'Estudiante';
  const isAdmin = userRole === 'Administrador';
  const isBasicUser = userRole === 'Usuario';

  return (
    <div className="menu-container">
      <button className="menu-button" aria-label="Menú principal" onClick={() => setOpen(!open)}>
        <Menu size={24} />
      </button>
      {open && (
        <nav className="menu-dropdown" role="menu">
          <button 
            className="menu-item" 
            onClick={() => handleNavigation("/")}
            aria-label="Ir a inicio"
            role="menuitem"
          >
            <Home size={20} /> 
            <span>Inicio</span>
          </button>
          
          {!isBasicUser && showTeacherOptions && (
            <button 
              className="menu-item" 
              onClick={() => handleNavigation("/mis-cursos")}
              aria-label="Ver mis cursos"
              role="menuitem"
            >
              <BookOpen size={20} /> 
              <span>Mis cursos</span>
            </button>
          )}

          {!isBasicUser && isAdmin && (
            <button 
              className="menu-item" 
              onClick={() => handleNavigation("/usuarios")}
              aria-label="Gestionar usuarios"
              role="menuitem"
            >
              <Users size={20} /> 
              <span>Gestionar Usuarios</span>
            </button>
          )}
          
          {!isBasicUser && (
            <button 
              className="menu-item" 
              onClick={() => handleNavigation("/perfil")}
              aria-label="Ver perfil"
              role="menuitem"
            >
              <User size={20} /> 
              <span>Perfil</span>
            </button>
          )}
          
          <button 
            className="menu-item logout" 
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            role="menuitem"
          >
            <LogOut size={20} /> 
            <span>Cerrar sesión</span>
          </button>
        </nav>
      )}
    </div>
  );
}

export default MenuButton;
