import React, { useState } from 'react';
import { db } from '../../../../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { Link, Save } from 'lucide-react';
import './Herramientas.css';

function GuardarMateriales({ cursoId, claseId }) {
  const [pdfUrl, setPdfUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!pdfUrl && !videoUrl) {
      setError('Debes proporcionar al menos un enlace');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const claseRef = doc(db, 'clases', claseId);
      const updateData = {};
      
      if (pdfUrl) updateData.pdfUrl = pdfUrl;
      if (videoUrl) updateData.videoUrl = videoUrl;
      
      await updateDoc(claseRef, updateData);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error al guardar materiales:', err);
      setError('Error al guardar los materiales');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="herramienta-card">
      <div className="herramienta-header">
        <h3>Materiales de Clase</h3>
      </div>
      <div className="herramienta-content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <Link size={16} />
              Enlace de PDF o material
            </label>
            <input
              type="url"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              placeholder="https://ejemplo.com/material.pdf"
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label>
              <Link size={16} />
              Enlace de video
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://ejemplo.com/video"
              className="form-control"
            />
          </div>
          
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">¡Materiales guardados correctamente!</p>}
          
          <button 
            type="submit" 
            className="herramienta-btn send-btn"
            disabled={loading}
          >
            <Save size={16} />
            {loading ? 'Guardando...' : 'Guardar Materiales'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default GuardarMateriales;