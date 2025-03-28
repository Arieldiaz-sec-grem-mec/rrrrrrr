import React from 'react';
import './Herramientas.css';

function Tareas() {
  return (
    <div className="herramienta-card">
      <div className="herramienta-header">
        <h3>Tareas</h3>
      </div>
      <div className="herramienta-content">
        <button className="herramienta-btn">
          Gestionar Tareas
        </button>
      </div>
    </div>
  );
}

export default Tareas;