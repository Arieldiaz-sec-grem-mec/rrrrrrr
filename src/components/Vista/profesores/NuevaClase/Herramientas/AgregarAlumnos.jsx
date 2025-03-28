import React, { useState, useEffect } from 'react';
import { db } from '../../../../../firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { X, Plus, Check } from 'lucide-react';
import './Herramientas.css';

function AgregarAlumnos({ cursoId, claseId }) {
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudiantesAgregados, setEstudiantesAgregados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    try {
      setLoading(true);
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('role', '==', 'Estudiante'));
      const querySnapshot = await getDocs(q);
      const estudiantesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        agregado: false
      }));
      setEstudiantes(estudiantesData);
    } catch (err) {
      setError('Error al cargar estudiantes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const agregarEstudiante = async (estudiante) => {
    try {
      // Actualizar la clase con el nuevo estudiante
      const claseRef = doc(db, 'clases', claseId);
      await updateDoc(claseRef, {
        estudiantes: arrayUnion({
          id: estudiante.id,
          nombre: estudiante.nombre || estudiante.displayName,
          apellido: estudiante.apellido,
          email: estudiante.email,
          fechaInscripcion: new Date().toISOString()
        })
      });

      // Actualizar estado local
      setEstudiantesAgregados(prev => [...prev, estudiante.id]);
      setEstudiantes(prev => 
        prev.map(est => 
          est.id === estudiante.id 
            ? { ...est, agregado: true }
            : est
        )
      );
    } catch (err) {
      setError('Error al agregar estudiante');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="herramienta-card">
        <div className="herramienta-header">
          <h3>Agregar Alumnos</h3>
        </div>
        <div className="herramienta-content">
          <p>Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="herramienta-card">
        <div className="herramienta-header">
          <h3>Agregar Alumnos</h3>
        </div>
        <div className="herramienta-content">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="herramienta-card">
      <div className="herramienta-header">
        <h3>Agregar Alumnos</h3>
      </div>
      <div className="herramienta-content">
        {estudiantes.length === 0 ? (
          <p>No hay estudiantes disponibles</p>
        ) : (
          <div className="estudiantes-lista">
            {estudiantes.map(estudiante => (
              <div key={estudiante.id} className="estudiante-item">
                <div className="estudiante-info">
                  <p>{estudiante.nombre || estudiante.displayName} {estudiante.apellido}</p>
                  <small>{estudiante.email}</small>
                </div>
                {estudiante.agregado || estudiantesAgregados.includes(estudiante.id) ? (
                  <button className="herramienta-btn agregado" disabled>
                    <Check size={16} />
                    Agregado
                  </button>
                ) : (
                  <button 
                    className="herramienta-btn"
                    onClick={() => agregarEstudiante(estudiante)}
                  >
                    <Plus size={16} />
                    Agregar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AgregarAlumnos;