import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './ClasesCreadas.css';

function ClasesCreadas() {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarClases();
  }, []);

  const cargarClases = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      const cursosRef = collection(db, "cursos");
      const q = query(
        cursosRef, 
        where("creadorId", "==", user.uid),
        where("tieneClaseVirtual", "==", true)
      );
      
      const querySnapshot = await getDocs(q);
      const clasesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setClases(clasesData);
    } catch (error) {
      console.error("Error al cargar las clases:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaseClick = (claseId) => {
    navigate(`/clase/${claseId}`);
  };

  return (
    <div className="clases-container">
      <h1>Mis Clases Virtuales</h1>
      
      {loading ? (
        <p>Cargando clases...</p>
      ) : (
        <div className="clases-grid">
          {clases.map(clase => (
            <div 
              key={clase.id} 
              className="clase-card"
              onClick={() => handleClaseClick(clase.id)}
            >
              <h3>{clase.nombre}</h3>
              <p className="clase-materia">{clase.materia}</p>
              <p className="clase-seccion">{clase.seccion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClasesCreadas;