import React, { useState } from "react";
import { Plus } from "lucide-react";
import "./CrearCurso.css";
import { db, auth } from "../../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

function CrearCurso() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    seccion: "",
    materia: "",
    aula: "",
    nivel: "basico", // New field
    categoria: "", // New field
    estado: "activo", // New field
    imagenUrl: "", // New field
    profesores: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim() // Standardize strings by trimming whitespace
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
        estudiantes: [], // Initialize empty students array
      };

      const docRef = await addDoc(collection(db, "cursos"), nuevoCurso);
      
      // Create initial module
      const moduloInicial = {
        id: uuidv4(),
        cursoId: docRef.id,
        titulo: "Módulo Inicial",
        descripcion: "Módulo de introducción al curso",
        orden: 1,
        fechaCreacion: fechaISO,
        lecciones: []
      };

      // Add initial module to the course
      await addDoc(collection(db, "modulos"), moduloInicial);

      setCursos(prev => [...prev, { ...nuevoCurso, id: docRef.id }]);
      setMostrarModal(false);
      setFormData({
        nombre: "",
        descripcion: "",
        seccion: "",
        materia: "",
        aula: "",
        nivel: "basico",
        categoria: "",
        estado: "activo",
        imagenUrl: "",
        profesores: []
      });
    } catch (error) {
      console.error("Error al crear el curso:", error);
      alert("Error al crear el curso. Por favor, intenta nuevamente.");
    }
  };

  return (
    <div className="classroom-container">
      <button className="crear-curso-btn" onClick={() => setMostrarModal(true)} title="Crear nuevo curso">
        <Plus size={24} strokeWidth={2} />
      </button>
      
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
                <select
                  name="nivel"
                  value={formData.nivel}
                  onChange={handleInputChange}
                  required
                >
                  <option value="basico">Básico</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
                <input
                  type="text"
                  name="categoria"
                  placeholder="Categoría del Curso"
                  value={formData.categoria}
                  onChange={handleInputChange}
                />
                <input
                  type="url"
                  name="imagenUrl"
                  placeholder="URL de la imagen del curso"
                  value={formData.imagenUrl}
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

      <div className="cursos-grid">
        {cursos.map((curso) => (
          <div key={curso.id} className="curso-card">
            {curso.imagenUrl && (
              <div 
                className="curso-imagen"
                style={{ backgroundImage: `url(${curso.imagenUrl})` }}
              />
            )}
            <div className="curso-info">
              <h3>{curso.nombre}</h3>
              <p>{curso.materia}</p>
              <p className="curso-seccion">{curso.seccion}</p>
              <p className="curso-nivel">{curso.nivel}</p>
              <p className="curso-categoria">{curso.categoria}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CrearCurso;
