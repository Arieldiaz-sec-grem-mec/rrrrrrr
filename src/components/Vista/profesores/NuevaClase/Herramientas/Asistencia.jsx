import React from 'react';
import './Herramientas.css';

function Asistencia() {
  return (
    <div className="herramienta-card">
      <div className="herramienta-header">
        <h3>Control de Asistencia</h3>
      </div>
      <div className="herramienta-content">
        <button className="herramienta-btn">
          Tomar Asistencia
        </button>
      </div>
    </div>
  );
}

export default Asistencia;