import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { db } from '../../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Settings, 
  FileText, 
  MessageSquare,
  Home,
  Plus
} from 'lucide-react';
import './Dashboard.css';
import { collection, getDocs, query, where } from 'firebase/firestore';

function Dashboard() {
  const { cursoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(location.state?.curso || null);
  const [loading, setLoading] = useState(!location.state?.curso);
  const [activeSection, setActiveSection] = useState('inicio');
  const [clases, setClases] = useState([]);
  const [loadingClases, setLoadingClases] = useState(false);

  useEffect(() => {
    const fetchCursoData = async () => {
      if (curso) return; // Skip if we already have course data
      
      try {
        const cursoRef = doc(db, "cursos", cursoId);
        const cursoDoc = await getDoc(cursoRef);
        
        if (cursoDoc.exists()) {
          setCurso({ id: cursoDoc.id, ...cursoDoc.data() });
        }
      } catch (error) {
        console.error("Error fetching curso:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCursoData();
  }, [cursoId, curso]);

  useEffect(() => {
    if (cursoId && activeSection === 'clases') {
      fetchClases();
    }
  }, [cursoId, activeSection]);

  const fetchClases = async () => {
    try {
      setLoadingClases(true);
      const clasesRef = collection(db, "clases");
      const q = query(clasesRef, where("cursoId", "==", cursoId));
      const querySnapshot = await getDocs(q);
      
      const clasesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setClases(clasesData);
    } catch (error) {
      console.error("Error al cargar las clases:", error);
    } finally {
      setLoadingClases(false);
    }
  };

  const handleCreateClase = () => {
    navigate(`/curso/${cursoId}/nueva-clase`);
  };

  const menuItems = [
    { icon: <Home size={24} />, label: 'Inicio', action: () => setActiveSection('inicio') },
    { icon: <BookOpen size={24} />, label: 'Clases', action: () => setActiveSection('clases') },
    { icon: <Users size={24} />, label: 'Alumnos', action: () => setActiveSection('alumnos') },
    { icon: <Calendar size={24} />, label: 'Calendario', action: () => setActiveSection('calendario') },
    { icon: <FileText size={24} />, label: 'Tareas', action: () => setActiveSection('tareas') },
    { icon: <MessageSquare size={24} />, label: 'Mensajes', action: () => setActiveSection('mensajes') },
    { icon: <Settings size={24} />, label: 'Configuración', action: () => setActiveSection('configuracion') }
  ];

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!curso) {
    return <div className="error">Curso no encontrado</div>;
  }

  return (
    <div className="dashboard-layout">
      <div className="sidebar">
        <div className="course-info">
          <h3>{curso.nombre}</h3>
          <p>{curso.materia}</p>
        </div>
        <nav className="menu-items">
          {menuItems.map((item, index) => (
            <button 
              key={index} 
              className={`menu-item ${activeSection === item.label.toLowerCase() ? 'active' : ''}`}
              onClick={item.action}
              title={item.label}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="main-content">
        <div className="dashboard-content">
          {activeSection === 'inicio' && (
            <div className="course-details">
              <h3>Información del Curso</h3>
              <p><strong>Materia:</strong> {curso.materia}</p>
              <p><strong>Sección:</strong> {curso.seccion}</p>
              <p><strong>Aula:</strong> {curso.aula}</p>
              <p><strong>Descripción:</strong> {curso.descripcion}</p>
            </div>
          )}
          {activeSection === 'clases' && (
            <div className="classes-container">
              <div className="classes-header">
                <h2>Clases del Curso</h2>
                <button 
                  className="add-class-button"
                  onClick={handleCreateClase}
                >
                  <Plus size={20} />
                  Nueva Clase
                </button>
              </div>
              
              {loadingClases ? (
                <div className="loading-classes">Cargando clases...</div>
              ) : clases.length === 0 ? (
                <div className="no-classes">
                  <p>No hay clases creadas para este curso</p>
                  <button 
                    className="create-first-class"
                    onClick={handleCreateClase}
                  >
                    Crear primera clase
                  </button>
                </div>
              ) : (
                <div className="clases-list">
                  {clases.map((clase) => (
                    <div key={clase.id} className="clase-card">
                      <h3>{clase.titulo}</h3>
                      <p className="clase-descripcion">{clase.descripcion}</p>
                      <p className="clase-fecha">
                        Fecha: {clase.fecha ? new Date(clase.fecha).toLocaleDateString() : 'No especificada'}
                      </p>
                      
                      <div className="clase-links">
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;