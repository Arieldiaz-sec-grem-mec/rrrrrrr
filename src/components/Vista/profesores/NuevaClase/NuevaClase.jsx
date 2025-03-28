import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../../../../firebaseConfig';
import { collection, addDoc, serverTimestamp, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { BookOpen, ArrowLeft, Loader, Save, Users, FileText, Video, Bell } from 'lucide-react';
import './NuevaClase.css';

function NuevaClase() {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [cursoInfo, setCursoInfo] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    pdfUrl: '',
    videoUrl: '',
    noticia: '',
    tareas: [''],
    estudiantesSeleccionados: []
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // Obtener información del curso
        const cursoRef = doc(db, "cursos", cursoId);
        const cursoDoc = await getDoc(cursoRef);
        
        if (cursoDoc.exists()) {
          const cursoData = cursoDoc.data();
          setCursoInfo(cursoData);
          setFormData(prev => ({
            ...prev,
            titulo: `Clase del ${new Date().toLocaleDateString()}`,
            descripcion: `Clase correspondiente al curso ${cursoData.nombre || 'actual'}`
          }));
        } else {
          setError("No se encontró el curso especificado");
          return;
        }
        
        // Cargar estudiantes
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('role', '==', 'Estudiante'));
        const querySnapshot = await getDocs(q);
        const estudiantesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          selected: false
        }));
        setEstudiantes(estudiantesData);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar la información necesaria");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [cursoId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTareaChange = (index, value) => {
    const nuevasTareas = [...formData.tareas];
    nuevasTareas[index] = value;
    setFormData(prev => ({
      ...prev,
      tareas: nuevasTareas
    }));
  };

  const handleAddTarea = () => {
    setFormData(prev => ({
      ...prev,
      tareas: [...prev.tareas, '']
    }));
  };

  const handleRemoveTarea = (index) => {
    const nuevasTareas = [...formData.tareas];
    nuevasTareas.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      tareas: nuevasTareas
    }));
  };

  const toggleEstudiante = (id) => {
    setEstudiantes(prev => 
      prev.map(est => 
        est.id === id 
          ? { ...est, selected: !est.selected }
          : est
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Preparar datos de estudiantes seleccionados
      const estudiantesSeleccionados = estudiantes
        .filter(est => est.selected)
        .map(est => ({
          id: est.id,
          nombre: est.nombre || est.displayName,
          apellido: est.apellido,
          email: est.email,
          fechaInscripcion: new Date().toISOString()
        }));
      
      // Preparar tareas válidas
      const tareasValidas = formData.tareas
        .filter(tarea => tarea.trim() !== '')
        .map(tarea => ({
          texto: tarea,
          fechaCreacion: new Date().toISOString(),
          completada: false
        }));
      
      // Crear la clase en Firestore
      const claseData = {
        cursoId,
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        fecha: formData.fecha,
        pdfUrl: formData.pdfUrl,
        videoUrl: formData.videoUrl,
        noticia: {
          texto: formData.noticia,
          fechaPublicacion: new Date().toISOString()
        },
        creadorId: auth.currentUser.uid,
        creadorNombre: auth.currentUser.displayName || auth.currentUser.email,
        creadorEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
        estudiantes: estudiantesSeleccionados,
        tareas: tareasValidas,
        estado: 'activa'
      };

      await addDoc(collection(db, 'clases'), claseData);
      
      // Redirigir al dashboard
      navigate(`/curso/${cursoId}/dashboard`);
    } catch (err) {
      console.error('Error al guardar la clase:', err);
      setError('Error al guardar la clase. Por favor, inténtalo de nuevo.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1><Loader size={24} className="icon-spin" /> Cargando</h1>
        </div>
        <div className="loading-container">
          <p>Preparando el formulario de clase...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Error</h1>
        </div>
        <div className="error-container">
          <p>{error}</p>
          <button 
            className="btn-primary"
            onClick={() => navigate(`/curso/${cursoId}/dashboard`)}
          >
            <ArrowLeft size={18} /> Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1><BookOpen size={24} className="icon-header" /> Nueva Clase Virtual</h1>
        <p className="subtitle">Completa el formulario para crear tu clase</p>
      </div>
      
      <form onSubmit={handleSubmit} className="clase-form">
        <div className="form-section">
          <h3><FileText size={20} /> Información de la Clase</h3>
          <div className="form-group">
            <label htmlFor="titulo">Título de la Clase</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className="form-control"
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="fecha">Fecha</label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3><Video size={20} /> Materiales</h3>
          <div className="form-group">
            <label htmlFor="pdfUrl">Enlace de PDF o material</label>
            <input
              type="url"
              id="pdfUrl"
              name="pdfUrl"
              value={formData.pdfUrl}
              onChange={handleInputChange}
              placeholder="https://ejemplo.com/material.pdf"
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="videoUrl">Enlace de video</label>
            <input
              type="url"
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleInputChange}
              placeholder="https://ejemplo.com/video"
              className="form-control"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3><Bell size={20} /> Noticia o Anuncio</h3>
          <div className="form-group">
            <label htmlFor="noticia">Noticia para la clase</label>
            <textarea
              id="noticia"
              name="noticia"
              value={formData.noticia}
              onChange={handleInputChange}
              placeholder="Escribe una noticia o anuncio importante para la clase"
              className="form-control"
              rows={3}
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3><FileText size={20} /> Tareas o Preguntas</h3>
          {formData.tareas.map((tarea, index) => (
            <div key={index} className="form-group tarea-input-group">
              <input
                type="text"
                value={tarea}
                onChange={(e) => handleTareaChange(index, e.target.value)}
                placeholder="Escribe una tarea o pregunta"
                className="form-control"
              />
              <div className="tarea-actions">
                {formData.tareas.length > 1 && (
                  <button 
                    type="button" 
                    className="icon-btn remove-btn"
                    onClick={() => handleRemoveTarea(index)}
                  >
                    -
                  </button>
                )}
                {index === formData.tareas.length - 1 && (
                  <button 
                    type="button" 
                    className="icon-btn add-btn"
                    onClick={handleAddTarea}
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="form-section">
          <h3><Users size={20} /> Alumnos</h3>
          <div className="estudiantes-lista">
            {estudiantes.length === 0 ? (
              <p>No hay estudiantes disponibles</p>
            ) : (
              estudiantes.map(estudiante => (
                <div key={estudiante.id} className="estudiante-item">
                  <label className="estudiante-checkbox">
                    <input
                      type="checkbox"
                      checked={estudiante.selected}
                      onChange={() => toggleEstudiante(estudiante.id)}
                    />
                    <div className="estudiante-info">
                      <p>{estudiante.nombre || estudiante.displayName} {estudiante.apellido}</p>
                      <small>{estudiante.email}</small>
                    </div>
                  </label>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => navigate(`/curso/${cursoId}/dashboard`)}
          >
            <ArrowLeft size={18} /> Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={saving}
          >
            <Save size={18} /> {saving ? 'Guardando...' : 'Guardar Clase'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NuevaClase;