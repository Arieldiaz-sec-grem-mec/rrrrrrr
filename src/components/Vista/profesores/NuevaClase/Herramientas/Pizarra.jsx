import React from 'react';
import './Herramientas.css';

function Pizarra() {
  return (
    <div className="herramienta-card">
      <div className="herramienta-header">
        <h3>Pizarra Virtual</h3>
      </div>
      <div className="herramienta-content">
        <button className="herramienta-btn">
          Abrir Pizarra
        </button>
      </div>
    </div>
  );
}

export default Pizarra;