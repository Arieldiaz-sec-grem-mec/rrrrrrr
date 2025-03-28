import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import CrearClase from './CrearClase';
import './ClasesPorCursos.css';
import GestionPreguntas from './Preguntas/GestionPreguntas';
import ListaPreguntas from './Preguntas/ListaPreguntas';

function ClasesPorCursos({ cursoId }) {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claseExpandida, setClaseExpandida] = useState(null);
  const [mostrarPreguntas, setMostrarPreguntas] = useState(false);
  const [claseSeleccionada, setClaseSeleccionada] = useState(null);
  const [preguntasPorClase, setPreguntasPorClase] = useState({});

  const fetchClases = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'clases'),
        where('cursoId', '==', cursoId)
      );
      const querySnapshot = await getDocs(q);
      const clasesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort from oldest to newest
      const sortedClases = clasesData.sort((a, b) => 
        a.createdAt?.seconds - b.createdAt?.seconds
      );
      setClases(sortedClases);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  }, [cursoId]);

  useEffect(() => {
    fetchClases();
  }, [fetchClases]);

  const handleClaseCreated = () => {
    fetchClases();
  };

  // Add a new function to fetch questions for a class
  const fetchPreguntasForClase = useCallback(async (claseId) => {
    try {
      const preguntasRef = collection(db, 'clases', claseId, 'preguntas');
      const snapshot = await getDocs(preguntasRef);
      const preguntasData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPreguntasPorClase(prev => ({
        ...prev,
        [claseId]: preguntasData
      }));
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }, []);

  // Modify the toggleClase function to fetch questions when expanding
  const toggleClase = (claseId) => {
    const newExpandedState = claseExpandida === claseId ? null : claseId;
    setClaseExpandida(newExpandedState);
    
    // If expanding a class, fetch its questions
    if (newExpandedState) {
      fetchPreguntasForClase(claseId);
    }
  };

  // Add a handler for when a question is deleted
  const handlePreguntaEliminada = (claseId) => {
    // Refresh the questions for this class
    fetchPreguntasForClase(claseId);
  };

  const handleOpenPreguntas = (claseId) => {
    setClaseSeleccionada(claseId);
    setMostrarPreguntas(true);
  };

  if (loading) {
    return <div className="loading">Cargando clases...</div>;
  }

  // In the render section, update the accordion content to include questions
  return (
    <div className="clases-por-curso">
      <h2>Clases del Curso</h2>
      
      {clases.length === 0 ? (
        <p className="no-clases">No hay clases creadas para este curso.</p>
      ) : (
        <div className="clases-lista">
          {clases.map((clase) => (
            <div key={clase.id} className="clase-accordion">
              <button 
                className={`clase-header ${claseExpandida === clase.id ? 'active' : ''}`}
                onClick={() => toggleClase(clase.id)}
              >
                {clase.titulo}
                <span className="expandir-icon">
                  {claseExpandida === clase.id ? '−' : '+'}
                </span>
              </button>
              
              {claseExpandida === clase.id && (
                <div className="clase-contenido">
                  <p className="clase-descripcion">{clase.descripcion}</p>
                  <div className="clase-fecha">
                    Fecha: {new Date(clase.fecha).toLocaleDateString()}
                  </div>
                  <div className="clase-recursos">
                    {clase.pdfUrl && (
                      <a 
                        href={clase.pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="recurso-link pdf"
                      >
                        Material PDF
                      </a>
                    )}
                    {clase.videoUrl && (
                      <a 
                        href={clase.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="recurso-link video"
                      >
                        Ver Video
                      </a>
                    )}
                  </div>
                  <div className="btn-group">
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleOpenPreguntas(clase.id)}
                    >
                      <i className="fas fa-question-circle"></i> Gestionar Preguntas
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <CrearClase cursoId={cursoId} onClaseCreated={handleClaseCreated} />

      {mostrarPreguntas && claseSeleccionada && (
        <GestionPreguntas 
          claseId={claseSeleccionada}
          onClose={() => {
            setMostrarPreguntas(false);
            // Refresh questions when closing the management modal
            if (claseExpandida === claseSeleccionada) {
              fetchPreguntasForClase(claseSeleccionada);
            }
          }}
        />
      )}
    </div>
  );
}

export default ClasesPorCursos;