import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebaseConfig';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { Plus, BookOpen, HelpCircle } from "lucide-react";
import './TeacherCourses.css';
import { useNavigate } from 'react-router-dom';

function TeacherCourses() {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    seccion: "",
    materia: "",
    aula: "",
    profesores: []
  });

  useEffect(() => {
    const cargarCursos = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
          setError("No hay usuario autenticado");
          return;
        }

        const cursosRef = collection(db, "cursos");
        const q = query(cursosRef, where("creadorId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        const cursosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setCursos(cursosData);
        setError(null);
      } catch (err) {
        console.error("Error al cargar los cursos:", err);
        setError("Error al cargar los cursos");
      } finally {
        setLoading(false);
      }
    };

    cargarCursos();
  }, []);

  const handleClickCurso = (curso) => {
    navigate(`/curso/${curso.id}/dashboard`, { state: { curso } });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarCurso = async (e) => {
    e.preventDefault();
    try {
      const usuario = auth.currentUser;
      if (!usuario) {
        alert("Debes estar autenticado para crear un curso");
        return;
      }

      const nuevoCurso = {
        ...formData,
        creadorId: usuario.uid,
        creadorEmail: usuario.email,
        creadorNombre: usuario.displayName,
        fechaCreacion: new Date(),
        profesores: [usuario.uid],
      };

      const docRef = await addDoc(collection(db, "cursos"), nuevoCurso);
      setCursos(prev => [...prev, { ...nuevoCurso, id: docRef.id }]);
      setMostrarModal(false);
      setFormData({
        nombre: "",
        descripcion: "",
        seccion: "",
        materia: "",
        aula: "",
        profesores: []
      });
    } catch (error) {
      console.error("Error al crear el curso:", error);
      alert("Error al crear el curso. Por favor, intenta nuevamente.");
    }
  };

  if (loading) {
    return <div className="loading">Cargando cursos...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="teacher-courses-container">
      <div className="header-actions">
        <h2>Mis Cursos</h2>
        <button 
          className="crear-curso-btn" 
          onClick={() => setMostrarModal(true)}
          title="Crear nuevo curso"
        >
          <Plus size={24} strokeWidth={2} />
        </button>
      </div>

      {/* Modal para crear curso */}
      {mostrarModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Crear Nuevo Curso</h2>
            <form onSubmit={agregarCurso}>
              <div className="form-section">
                <h3>Información General del Curso</h3>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre del Curso"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
                <textarea
                  name="descripcion"
                  placeholder="Descripción del Curso"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="seccion"
                  placeholder="Sección (ej: Sección A, Matutino)"
                  value={formData.seccion}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="materia"
                  placeholder="Materia"
                  value={formData.materia}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="aula"
                  placeholder="Aula"
                  value={formData.aula}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">Crear Curso</button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setMostrarModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {cursos.length === 0 ? (
        <div className="no-courses">
          <p>No tienes cursos creados todavía</p>
        </div>
      ) : (
        <div className="courses-grid">
          {cursos.map((curso) => (
            <div 
              key={curso.id} 
              className="course-card"
              onClick={() => handleClickCurso(curso)}
            >
              {curso.imagenPortadaUrl && (
                <div 
                  className="course-image" 
                  style={{ backgroundImage: `url(${curso.imagenPortadaUrl})` }}
                />
              )}
              <div className="course-info">
                <h3>{curso.nombre}</h3>
                <p className="course-subject">{curso.materia}</p>
                <p className="course-section">{curso.seccion}</p>
                {/* Removing the course-actions div that contains the buttons */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TeacherCourses;