// components/bookings/BookingList.js - User's bookings
import React, { useState, useEffect } from 'react';
import { getUserBookings, cancelBooking } from '../Apis';

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getUserBookings();
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
  
  if (loading) {
    return <div className="loading">Loading your bookings...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="booking-list-container">
      <h2>My Bookings</h2>
      
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <div className="booking-list">
          {bookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <h3>{booking.eventName}</h3>
              <p><strong>Ticket Type:</strong> {booking.ticketType}</p>
              <p><strong>Quantity:</strong> {booking.quantity}</p>
              <p><strong>Total Price:</strong> £{booking.price}</p>
              <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
              <p className={`booking-status ${booking.status}`}>
                <strong>Status:</strong> {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </p>
              
              {booking.status === 'active' && (
                <button
                  onClick={() => handleCancelBooking(booking.id)}
                  className="btn-danger"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingList;
