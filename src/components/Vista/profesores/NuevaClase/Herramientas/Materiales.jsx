import React from 'react';
import './Herramientas.css';

function Materiales() {
  return (
    <div className="herramienta-card">
      <div className="herramienta-header">
        <h3>Materiales</h3>
      </div>
      <div className="herramienta-content">
        <button className="herramienta-btn">
          Gestionar Materiales
        </button>
      </div>
    </div>
  );
}

export default Materiales;