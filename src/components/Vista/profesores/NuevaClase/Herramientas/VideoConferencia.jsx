import React from 'react';
import './Herramientas.css';

function VideoConferencia() {
  return (
    <div className="herramienta-card">
      <div className="herramienta-header">
        <h3>Video Conferencia</h3>
      </div>
      <div className="herramienta-content">
        <button className="herramienta-btn">
          Iniciar Video
        </button>
      </div>
    </div>
  );
}

export default VideoConferencia;