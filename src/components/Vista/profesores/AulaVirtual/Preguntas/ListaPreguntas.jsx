import React from 'react';
import { db } from '../../../../../firebaseConfig';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';

const ListaPreguntas = ({ preguntas = [], claseId, onPreguntaEliminada }) => {
  const eliminarPregunta = async (docId, e) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (window.confirm('¿Está seguro de eliminar esta pregunta? Esta acción no se puede deshacer.')) {
      try {
        if (!claseId || !docId) {
          throw new Error('ID de clase o pregunta no válido');
        }

        const cleanClaseId = String(claseId).trim();
        const cleanDocId = String(docId).trim();
        
        console.log('Intentando eliminar pregunta:', {
          claseId: cleanClaseId,
          docId: cleanDocId,
          docIdOriginal: docId
        });

        const preguntaRef = doc(db, 'clases', cleanClaseId, 'preguntas', cleanDocId);
        console.log('Ruta completa:', preguntaRef.path);
        
        const preguntaDoc = await getDoc(preguntaRef);
        if (!preguntaDoc.exists()) {
          console.error('Documento no encontrado en la ruta:', preguntaRef.path);
          throw new Error('La pregunta no existe en la base de datos');
        }

        await deleteDoc(preguntaRef);
        console.log('Pregunta eliminada exitosamente');
        
        // Notificar que la pregunta fue eliminada para actualizar la UI
        if (onPreguntaEliminada) {
          onPreguntaEliminada(cleanDocId);
        }
        
        // Mostrar mensaje de éxito
        alert('Pregunta eliminada exitosamente');
      } catch (error) {
        console.error('Error al eliminar pregunta:', error);
        alert('Error al eliminar la pregunta. Por favor, intente nuevamente.');
      }
    }
  };

  if (!preguntas || preguntas.length === 0) {
    return <p className="text-muted">No hay preguntas agregadas</p>;
  }

  return (
    <div className="lista-preguntas">
      {preguntas.map((pregunta, index) => (
        <div key={pregunta.docId || index} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Pregunta {index + 1}</h5>
            <p className="card-text">{pregunta.texto || pregunta.pregunta}</p>
            
            {/* Mostrar campos adicionales */}
            {Object.entries(pregunta).map(([key, value]) => {
              // Excluir campos internos y la pregunta principal
              if (key !== 'docId' && key !== 'texto' && key !== 'pregunta' && key !== 'fechaCreacion') {
                return (
                  <div key={key} className="campo-adicional">
                    <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
                  </div>
                );
              }
              return null;
            })}
            
            <button
              className="btn btn-danger btn-sm mt-3"
              onClick={(e) => eliminarPregunta(pregunta.docId, e)}
            >
              <i className="fas fa-trash"></i> Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListaPreguntas;