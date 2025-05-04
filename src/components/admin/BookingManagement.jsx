// components/admin/BookingManagement.js - Manage bookings
import React, { useState, useEffect } from 'react';
import { getAllBookings, cancelBooking } from '../Apis';

function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllBookings();
        setBookings(data);
      } catch (err) {
        setError('Failed to load bookings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);
  
  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(id);
        // Update bookings list
        setBookings(bookings.map(booking => 
          booking.id === id ? { ...booking, status: 'cancelled' } : booking
        ));
      } catch (err) {
        setError('Failed to cancel booking');
        console.error(err);
      }
    }
  };
  
  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);
  
  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="admin-booking-container">
      <h2>Booking Management</h2>
      
      <div className="filter-controls">
        <label htmlFor="status-filter">Filter by Status:</label>
        <select
          id="status-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Bookings</option>
          <option value="active">Active</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      
      {filteredBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="booking-table-container">
          <table className="booking-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Event</th>
                <th>Ticket Type</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Status</th>
                <th>Booking Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                <tr key={booking.id} className={booking.status}>
                  <td>{booking.id}</td>
                  <td>{booking.username}</td>
                  <td>{booking.eventName}</td>
                  <td>{booking.ticketType}</td>
                  <td>{booking.quantity}</td>
                  <td>£{booking.price}</td>
                  <td>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</td>
                  <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td>
                    {booking.status === 'active' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="btn-danger btn-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BookingManagement;
