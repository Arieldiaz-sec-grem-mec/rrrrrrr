import React, { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Edit2, Save } from 'lucide-react';
import './AllUsers.css';

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
  };

  const handleSave = async () => {
    try {
      const userRef = doc(db, 'users', editingUser.id);
      await updateDoc(userRef, {
        nombre: editingUser.nombre,
        apellido: editingUser.apellido,
        role: editingUser.role
      });
      
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      setEditingUser(null);
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
      alert('Error al guardar los cambios');
    }
  };

  if (loading) return <div className="loading">Cargando usuarios...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="users-container">
      <h2>Gestión de Usuarios</h2>
      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            {editingUser?.id === user.id ? (
              <>
                <div className="edit-form">
                  <input
                    type="text"
                    value={editingUser.nombre}
                    onChange={(e) => setEditingUser({...editingUser, nombre: e.target.value})}
                  />
                  <input
                    type="text"
                    value={editingUser.apellido}
                    onChange={(e) => setEditingUser({...editingUser, apellido: e.target.value})}
                  />
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  >
                    <option value="Usuario">Usuario</option>
                    <option value="Estudiante">Estudiante</option>
                    <option value="Profesor">Profesor</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                  <button onClick={handleSave} className="save-btn">
                    <Save size={18} /> Guardar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="user-info">
                  <h3>{user.nombre} {user.apellido}</h3>
                  <p className="user-email">{user.email}</p>
                  <p className="user-role">Rol: {user.role}</p>
                </div>
                <button onClick={() => handleEdit(user)} className="edit-btn">
                  <Edit2 size={18} /> Editar
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllUsers;