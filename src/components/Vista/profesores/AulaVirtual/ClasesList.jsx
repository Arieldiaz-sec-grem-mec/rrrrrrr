import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../../../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Plus } from "lucide-react";
import './CrearClase.css';
import CrearClase from './CrearClase';

function ClasesList() {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCrearClase, setShowCrearClase] = useState(false);

  useEffect(() => {
    const cargarClases = async () => {
      try {
        setLoading(true);
        if (!cursoId) {
          setError("No hay curso seleccionado");
          return;
        }

        const clasesRef = collection(db, "clases");
        const q = query(clasesRef, where("cursoId", "==", cursoId));
        const querySnapshot = await getDocs(q);
        
        const clasesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setClases(clasesData);
        setError(null);
      } catch (err) {
        console.error("Error al cargar las clases:", err);
        setError("Error al cargar las clases");
      } finally {
        setLoading(false);
      }
    };

    cargarClases();
  }, [cursoId]);

  const handleClaseCreated = () => {
    // Refresh the classes list after a new class is created
    const cargarClases = async () => {
      try {
        const clasesRef = collection(db, "clases");
        const q = query(clasesRef, where("cursoId", "==", cursoId));
        const querySnapshot = await getDocs(q);
        
        const clasesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setClases(clasesData);
      } catch (err) {
        console.error("Error al recargar las clases:", err);
      }
    };

    cargarClases();
  };

  if (loading) {
    return <div className="loading">Cargando clases...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="clases-container">
      <h2>Clases del Curso</h2>

      {clases.length === 0 ? (
        <div className="no-courses">
          <p>No hay clases creadas para este curso</p>
        </div>
      ) : (
        <div className="clases-list">
          {clases.map((clase) => (
            <div 
              key={clase.id} 
              className="clase-card"
            >
              <h3>{clase.titulo}</h3>
              <p>{clase.descripcion}</p>
              <p className="clase-fecha">
                Fecha: {clase.fecha ? new Date(clase.fecha).toLocaleDateString() : 'No especificada'}
              </p>
              
              <div className="clase-links">
                {clase.pdfUrl && (
                  <a href={clase.pdfUrl} target="_blank" rel="noopener noreferrer">Material PDF</a>
                )}
                {clase.videoUrl && (
                  <a href={clase.videoUrl} target="_blank" rel="noopener noreferrer">Ver Video</a>
                )}
              </div>
              
              {/* Removed the Preguntas button completely */}
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Button for creating a new class */}
      <button 
        className="fab-button"
        onClick={() => setShowCrearClase(true)}
        title="Crear nueva clase"
      >
        <Plus size={24} />
      </button>

      {showCrearClase && (
        <div className="modal">
          <div className="modal-content">
            <h2>Crear Nueva Clase</h2>
            <CrearClase 
              cursoId={cursoId} 
              onClaseCreated={handleClaseCreated} 
              onClose={() => setShowCrearClase(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ClasesList;