import React, { useState } from 'react';
import AgregarAlumnos from './AgregarAlumnos';
import './Herramientas.css';

function Alumnos({ cursoId }) {
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <>
      <div className="herramienta-card">
        <div className="herramienta-header">
          <h3>Estudiantes</h3>
        </div>
        <div className="herramienta-content">
          <button 
            className="herramienta-btn"
            onClick={() => setMostrarModal(true)}
          >
            Ver Estudiantes
          </button>
        </div>
      </div>

      {mostrarModal && (
        <AgregarAlumnos 
          cursoId={cursoId}
          onClose={() => setMostrarModal(false)}
        />
      )}
    </>
  );
}

export default Alumnos;