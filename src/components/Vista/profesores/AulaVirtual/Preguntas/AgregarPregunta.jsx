import React, { useState } from 'react';
import { db } from '../../../../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const AgregarPregunta = ({ claseId, onClose, onPreguntaAgregada }) => {
  const [pregunta, setPregunta] = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!pregunta.trim()) {
      alert('Por favor, ingrese una pregunta');
      return;
    }
    
    try {
      setGuardando(true);
      
      // Crear la estructura correcta para Firestore
      const preguntaData = {
        texto: pregunta,
        id: Date.now() // Usar timestamp como ID numérico
      };
      
      const preguntasRef = collection(db, 'clases', claseId, 'preguntas');
      await addDoc(preguntasRef, preguntaData);
      
      // Limpiar el formulario
      setPregunta('');
      onPreguntaAgregada();
      
      // Notificar al usuario
      alert('Pregunta guardada correctamente');
    } catch (error) {
      console.error('Error al agregar pregunta:', error);
      alert('Error al guardar la pregunta');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="pregunta">Nueva Pregunta:</label>
            <textarea
              id="pregunta"
              className="form-control"
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value)}
              required
              rows="3"
              placeholder="Escriba su pregunta aquí"
            />
          </div>

          <div className="mt-3">
            <button 
              type="submit" 
              className="btn btn-primary me-2"
              disabled={guardando}
            >
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarPregunta;