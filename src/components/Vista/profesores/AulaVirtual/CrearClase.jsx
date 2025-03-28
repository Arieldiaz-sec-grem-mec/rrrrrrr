import React, { useState } from 'react';
import { db } from '../../../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Plus } from 'lucide-react';
import './CrearClase.css';

function CrearClase({ cursoId, onClaseCreated, onClose }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    pdfUrl: '',
    videoUrl: '',
    fecha: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const claseData = {
        ...formData,
        cursoId,
        createdAt: serverTimestamp(),
      };

      const clasesRef = collection(db, 'clases');
      await addDoc(clasesRef, claseData);
      
      setFormData({
        titulo: '',
        descripcion: '',
        pdfUrl: '',
        videoUrl: '',
        fecha: ''
      });
      
      if (onClaseCreated) onClaseCreated();
      if (onClose) onClose();
    } catch (error) {
      console.error('Error al crear la clase:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="clase-form">
      <div className="form-group">
        <label htmlFor="titulo">Título de la Clase:</label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="descripcion">Descripción:</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="fecha">Fecha de la Clase:</label>
        <input
          type="date"
          id="fecha"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="pdfUrl">URL del PDF:</label>
        <input
          type="url"
          id="pdfUrl"
          name="pdfUrl"
          value={formData.pdfUrl}
          onChange={handleChange}
          placeholder="https://drive.google.com/file/..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="videoUrl">URL del Video:</label>
        <input
          type="url"
          id="videoUrl"
          name="videoUrl"
          value={formData.videoUrl}
          onChange={handleChange}
          placeholder="https://youtube.com/... o https://drive.google.com/..."
        />
      </div>

      <div className="form-actions">
        <button type="submit">Guardar Clase</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </div>
    </form>
  );
}

export default CrearClase;