import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header({ onLogout }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="header">
      <div className="header-content">
        <h1>📊 2GIS Reviews Monitor</h1>
        <nav>
          <Link to="/dashboard" className={isActive('/dashboard')}>
            Главная
          </Link>
          <Link to="/companies" className={isActive('/companies')}>
            Компании
          </Link>
          <Link to="/profile" className={isActive('/profile')}>
            Профиль
          </Link>
          <button onClick={onLogout} className="btn btn-secondary">
            Выход
          </button>
        </nav>
      </div>
    </div>
  );
}

export default Header;