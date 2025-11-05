import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  const doLogout = async () => {
    await logout();
    nav('/');
  };

  return (
    <header className="nav">
      <div className="nav-left">
        <Link to="/"><strong>Calmly</strong></Link>
      </div>
      <nav className="nav-right">
        {user ? (
          <>
            <Link to={user.role === 'therapist' ? '/therapist-dashboard' : '/client-dashboard'}>Dashboard</Link>
            <Link to="/mood">Mood</Link>
            <Link to="/journal">Journal</Link>
            <Link to="/resources">Resources</Link>
            <Link to="/appointments">Appointments</Link>
            <button className="btn-ghost" onClick={doLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
