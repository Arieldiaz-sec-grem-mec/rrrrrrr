import React, { useState, useEffect } from 'react';
import { db } from '../../../../../firebaseConfig';
import ListaPreguntas from './ListaPreguntas';
import AgregarPregunta from './AgregarPregunta';
import { collection, getDocs } from 'firebase/firestore';

const GestionPreguntas = ({ claseId }) => {
  const [preguntas, setPreguntas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const obtenerPreguntas = React.useCallback(async () => {
    try {
      if (!claseId) return;
      
      console.log('Obteniendo preguntas para clase:', claseId);
      const preguntasRef = collection(db, 'clases', claseId, 'preguntas');
      const snapshot = await getDocs(preguntasRef);
      const preguntasData = snapshot.docs.map(doc => {
        const data = {
          docId: doc.id,
          ...doc.data()
        };
        console.log('Pregunta encontrada:', data);
        return data;
      });
      setPreguntas(preguntasData);
    } catch (error) {
      console.error("Error al obtener preguntas:", error);
      setPreguntas([]);
    }
  }, [claseId]);

  useEffect(() => {
    obtenerPreguntas();
  }, [obtenerPreguntas]);

  const handlePreguntaEliminada = async (preguntaId) => {
    try {
      console.log('Manejando eliminación de pregunta:', preguntaId);
      // Primero actualizar el estado local
      setPreguntas(prevPreguntas => {
        const nuevasPreguntas = prevPreguntas.filter(p => p.docId !== preguntaId);
        console.log('Nuevas preguntas después de eliminar:', nuevasPreguntas);
        return nuevasPreguntas;
      });
      
      // Luego recargar las preguntas de la base de datos
      await obtenerPreguntas();
    } catch (error) {
      console.error("Error al actualizar lista de preguntas:", error);
      // Si hay error, recargar las preguntas para asegurar sincronización
      await obtenerPreguntas();
    }
  };

  return (
    <div className="preguntas-container">
      <h3>Preguntas de la Clase</h3>
      <button 
        className="btn btn-success mb-3"
        onClick={() => setMostrarFormulario(true)}
      >
        <i className="fas fa-plus"></i> Agregar Pregunta
      </button>
      
      {mostrarFormulario && (
        <AgregarPregunta 
          claseId={claseId}
          onClose={() => setMostrarFormulario(false)}
          onPreguntaAgregada={obtenerPreguntas}
        />
      )}

      <ListaPreguntas 
        preguntas={preguntas}
        claseId={claseId}
        onPreguntaEliminada={handlePreguntaEliminada}
      />
    </div>
  );
};

export default GestionPreguntas;