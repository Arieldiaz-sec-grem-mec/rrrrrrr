import React from 'react';
import './Herramientas.css';

function Documentos() {
  return (
    <div className="herramienta-card">
      <div className="herramienta-header">
        <h3>Documentos</h3>
      </div>
      <div className="herramienta-content">
        <button className="herramienta-btn">
          Gestionar Documentos
        </button>
      </div>
    </div>
  );
}

export default Documentos;