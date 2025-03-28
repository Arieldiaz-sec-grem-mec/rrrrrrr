import React, { useState } from 'react';
import { db } from '../../../../../firebaseConfig';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Plus, Save, X } from 'lucide-react';
import './Herramientas.css';

function TareasPreguntas({ cursoId, claseId }) {
  const [tareas, setTareas] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleAddTarea = () => {
    setTareas([...tareas, '']);
  };

  const handleRemoveTarea = (index) => {
    const nuevasTareas = [...tareas];
    nuevasTareas.splice(index, 1);
    setTareas(nuevasTareas);
  };

  const handleTareaChange = (index, value) => {
    const nuevasTareas = [...tareas];
    nuevasTareas[index] = value;
    setTareas(nuevasTareas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filtrar tareas vacías
    const tareasValidas = tareas.filter(tarea => tarea.trim() !== '');
    
    if (tareasValidas.length === 0) {
      setError('Debes agregar al menos una tarea o pregunta');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const claseRef = doc(db, 'clases', claseId);
      
      // Actualizar cada tarea individualmente usando arrayUnion
      for (const tarea of tareasValidas) {
        await updateDoc(claseRef, {
          tareas: arrayUnion({
            texto: tarea,
            fechaCreacion: new Date().toISOString(),
            completada: false
          })
        });
      }
      
      // Limpiar el formulario
      setTareas(['']);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error al guardar tareas:', err);
      setError('Error al guardar las tareas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="herramienta-card">
      <div className="herramienta-header">
        <h3>Tareas y Preguntas</h3>
      </div>
      <div className="herramienta-content">
        <form onSubmit={handleSubmit}>
          {tareas.map((tarea, index) => (
            <div key={index} className="form-group tarea-input-group">
              <input
                type="text"
                value={tarea}
                onChange={(e) => handleTareaChange(index, e.target.value)}
                placeholder="Escribe una tarea o pregunta"
                className="form-control"
              />
              <div className="tarea-actions">
                {tareas.length > 1 && (
                  <button 
                    type="button" 
                    className="icon-btn remove-btn"
                    onClick={() => handleRemoveTarea(index)}
                  >
                    <X size={16} />
                  </button>
                )}
                {index === tareas.length - 1 && (
                  <button 
                    type="button" 
                    className="icon-btn add-btn"
                    onClick={handleAddTarea}
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">¡Tareas guardadas correctamente!</p>}
          
          <button 
            type="submit" 
            className="herramienta-btn send-btn"
            disabled={loading}
          >
            <Save size={16} />
            {loading ? 'Guardando...' : 'Guardar Tareas'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TareasPreguntas;