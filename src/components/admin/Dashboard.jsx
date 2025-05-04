// components/admin/Dashboard.js - Admin dashboard
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, getAllUsers, getAllBookings } from '../Apis';

function AdminDashboard() {
  const [stats, setStats] = useState({
    events: 0,
    users: 0,
    bookings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [events, users, bookings] = await Promise.all([
          getEvents(),
          getAllUsers(),
          getAllBookings()
        ]);
        
        setStats({
          events: events.length,
          users: users.length,
          bookings: bookings.length
        });
      } catch (err) {
        setError('Failed to load dashboard statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Events</h3>
          <p className="stat-number">{stats.events}</p>
          <Link to="/admin/events/new" className="btn-primary">
            Create Event
          </Link>
        </div>
        
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.users}</p>
          <Link to="/admin/users" className="btn-secondary">
            Manage Users
          </Link>
        </div>
        
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-number">{stats.bookings}</p>
          <Link to="/admin/bookings" className="btn-secondary">
            Manage Bookings
          </Link>
        </div>
      </div>
      
      <div className="admin-links">
        <h3>Quick Links</h3>
        <div className="admin-links-grid">
          <Link to="/admin/events/new" className="admin-link-card">
            <h4>Create New Event</h4>
            <p>Add a new event with tickets</p>
          </Link>
          
          <Link to="/" className="admin-link-card">
            <h4>View All Events</h4>
            <p>See all events on the main page</p>
          </Link>
          
          <Link to="/admin/users" className="admin-link-card">
            <h4>User Management</h4>
            <p>View and manage user accounts</p>
          </Link>
          
          <Link to="/admin/bookings" className="admin-link-card">
            <h4>Booking Management</h4>
            <p>View and manage all bookings</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;