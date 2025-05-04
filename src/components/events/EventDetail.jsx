// components/events/EventDetail.js - Event details page
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEventById } from '../Apis';
import { useAuth } from '../context/AuthContext';

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id);
        setEvent(data);
      } catch (err) {
        setError('Failed to load event details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id]);
  
  if (loading) {
    return <div className="loading">Loading event details...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (!event) {
    return <div className="not-found">Event not found</div>;
  }
  
  return (
    <div className="event-detail-container">
      <h2>{event.name}</h2>
      
      <div className="event-info">
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Description:</strong> {event.description}</p>
      </div>
      
      <div className="ticket-section">
        <h3>Available Tickets</h3>
        
        {event.tickets && event.tickets.length > 0 ? (
          <div className="ticket-list">
            {event.tickets.map(ticket => (
              <div key={ticket.id} className="ticket-card">
                <h4>{ticket.ticketType}</h4>
                <p className="ticket-price">£{ticket.price}</p>
                <p className="ticket-availability">
                  {ticket.availability > 0 
                    ? `${ticket.availability} tickets available` 
                    : 'Sold out'}
                </p>
                
                {isAuthenticated && ticket.availability > 0 && (
                  <button 
                    onClick={() => navigate(`/book/${ticket.id}`)} 
                    className="btn-primary"
                  >
                    Book Now
                  </button>
                )}
                
                {!isAuthenticated && ticket.availability > 0 && (
                  <Link to="/login" className="btn-secondary">
                    Login to Book
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No tickets available for this event.</p>
        )}
      </div>
      
      {isAuthenticated && user.isAdmin && (
        <div className="admin-actions">
          <Link to={`/admin/events/edit/${event.id}`} className="btn-secondary">
            Edit Event
          </Link>
        </div>
      )}
    </div>
  );
}

export default EventDetail;