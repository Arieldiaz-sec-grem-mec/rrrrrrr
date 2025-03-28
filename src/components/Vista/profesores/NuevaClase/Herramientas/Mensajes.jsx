import React from 'react';
import './Herramientas.css';

function Mensajes() {
  return (
    <div className="herramienta-card">
      <div className="herramienta-header">
        <h3>Mensajes</h3>
      </div>
      <div className="herramienta-content">
        <button className="herramienta-btn">
          Ver Mensajes
        </button>
      </div>
    </div>
  );
}

export default Mensajes;