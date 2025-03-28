import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../../../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './Herramientas.css';

function AlumnosInvitados({ cursoId, onClose }) {
  const [invitaciones, setInvitaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarInvitaciones = useCallback(async () => {
    try {
      setLoading(true);
      const invitacionesRef = collection(db, 'invitaciones');
      const q = query(invitacionesRef, where('cursoId', '==', cursoId));
      const querySnapshot = await getDocs(q);
      
      const invitacionesData = [];
      
      for (const doc of querySnapshot.docs) {
        const invitacion = doc.data();
        const userRef = collection(db, 'users');
        const userQuery = query(userRef, where('__name__', '==', invitacion.estudianteId));
        const userSnapshot = await getDocs(userQuery);
        
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          invitacionesData.push({
            id: doc.id,
            ...invitacion,
            estudiante: userData
          });
        }
      }

      setInvitaciones(invitacionesData);
    } catch (error) {
      console.error('Error al cargar invitaciones:', error);
    } finally {
      setLoading(false);
    }
  }, [cursoId]);

  useEffect(() => {
    cargarInvitaciones();
  }, [cargarInvitaciones]);

  const formatearFecha = (fecha) => {
    if (!(fecha instanceof Date)) {
      fecha = fecha.toDate();
    }
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Alumnos Invitados</h2>
          <button 
            className="close-btn"
            onClick={onClose}
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>
        
        {loading ? (
          <p>Cargando invitaciones...</p>
        ) : (
          <div className="estudiantes-tabla-container">
            <table className="estudiantes-tabla">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Fecha de Invitación</th>
                </tr>
              </thead>
              <tbody>
                {invitaciones.map(invitacion => (
                  <tr key={invitacion.id}>
                    <td>{invitacion.estudiante.nombre}</td>
                    <td>{invitacion.estudiante.apellido}</td>
                    <td>{invitacion.estudiante.email}</td>
                    <td>
                      <span className={`estado-${invitacion.estado}`}>
                        {invitacion.estado.charAt(0).toUpperCase() + invitacion.estado.slice(1)}
                      </span>
                    </td>
                    <td>{formatearFecha(invitacion.fechaInvitacion)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlumnosInvitados;