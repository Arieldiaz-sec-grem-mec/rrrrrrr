import React from 'react';
import { User } from 'lucide-react';
import './usuario.css';

function Usuario({ user }) {
  if (!user) return null;

  return (
    <div className="user-header">
      <div className="user-avatar">
        <User size={24} />
      </div>
      <div className="user-info">
      <span className="user-role">{user.role || 'Usuario'}</span>
        <span className="user-name">{user.displayName || 'Usuario'}</span>
      </div>
    </div>
  );
}

export default Usuario;