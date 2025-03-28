import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { db } from '../../../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import './NuevaClase.css';

function GuardarClase({ cursoId }) {
  const [saving, setSaving] = useState(false);

  const guardarClase = async () => {
    if (!cursoId) return;
    
    try {
      setSaving(true);
      const cursoRef = doc(db, 'cursos', cursoId);
      
      await updateDoc(cursoRef, {
        tieneClaseVirtual: true,
        fechaActualizacion: new Date(),
      });

      alert('Clase guardada exitosamente');
    } catch (error) {
      console.error('Error al guardar la clase:', error);
      alert('Error al guardar la clase');
    } finally {
      setSaving(false);
    }
  };

  return (
    <button 
      className={`guardar-clase-btn ${saving ? 'saving' : ''}`}
      onClick={guardarClase}
      disabled={saving}
      title="Guardar Clase"
    >
      <Save size={24} />
      {saving && <span className="saving-text">Guardando...</span>}
    </button>
  );
}

export default GuardarClase;