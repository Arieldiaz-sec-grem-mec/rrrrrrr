import React from 'react';
import './Herramientas.css';

function Chat() {
  return (
    <div className="herramienta-card">
      <div className="herramienta-header">
        <h3>Chat de Clase</h3>
      </div>
      <div className="herramienta-content">
        <button className="herramienta-btn">
          Abrir Chat
        </button>
      </div>
    </div>
  );
}

export default Chat;