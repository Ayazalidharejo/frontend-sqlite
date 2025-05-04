// components/common/Navbar.js - Navigation bar
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Ticket Booking System</Link>
      </div>
      
      <div className="navbar-menu">
        <Link to="/" className="navbar-item">Events</Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/bookings" className="navbar-item">My Bookings</Link>
            
            {user && user.isAdmin && (
              <Link to="/admin" className="navbar-item">Admin Dashboard</Link>
            )}
            
            <span className="navbar-item">Welcome, {user.username}!</span>
            <button onClick={logout} className="navbar-item btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-item">Login</Link>
            <Link to="/register" className="navbar-item">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
