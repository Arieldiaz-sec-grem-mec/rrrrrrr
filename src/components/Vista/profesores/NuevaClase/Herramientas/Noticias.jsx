import React, { useState } from 'react';
import { db } from '../../../../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { Save } from 'lucide-react';
import './Herramientas.css';

function Noticias({ cursoId, claseId }) {
  const [noticia, setNoticia] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!noticia.trim()) {
      setError('El campo de noticia no puede estar vacío');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const claseRef = doc(db, 'clases', claseId);
      await updateDoc(claseRef, {
        noticia: {
          texto: noticia,
          fechaPublicacion: new Date().toISOString()
        }
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error al guardar noticia:', err);
      setError('Error al guardar la noticia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="herramienta-card">
      <div className="herramienta-header">
        <h3>Noticias</h3>
      </div>
      <div className="herramienta-content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Noticia o anuncio para la clase</label>
            <textarea
              value={noticia}
              onChange={(e) => setNoticia(e.target.value)}
              placeholder="Escribe una noticia o anuncio importante para la clase"
              className="form-control"
              rows={4}
            />
          </div>
          
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">¡Noticia guardada correctamente!</p>}
          
          <button 
            type="submit" 
            className="herramienta-btn send-btn"
            disabled={loading}
          >
            <Save size={16} />
            {loading ? 'Guardando...' : 'Publicar Noticia'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Noticias;