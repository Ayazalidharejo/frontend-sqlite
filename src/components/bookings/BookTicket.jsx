// components/bookings/BookTicket.js - Booking form
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketById, createBooking } from '../Apis';

function BookTicket() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await getTicketById(ticketId);
        setTicket(data);
      } catch (err) {
        setError('Failed to load ticket information');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTicket();
  }, [ticketId]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (quantity < 1 || quantity > ticket.availability) {
      setError(`Please select a quantity between 1 and ${ticket.availability}`);
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      await createBooking({
        ticketId: ticket.id,
        quantity
      });
      
      navigate('/bookings');
    } catch (err) {
      setError('Failed to book ticket');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Loading ticket information...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (!ticket) {
    return <div className="not-found">Ticket not found</div>;
  }
  
  return (
    <div className="book-ticket-container">
      <h2>Book Tickets</h2>
      
      <div className="ticket-info">
        <h3>{ticket.eventName}</h3>
        <p><strong>Ticket Type:</strong> {ticket.ticketType}</p>
        <p><strong>Price:</strong> £{ticket.price} per ticket</p>
        <p><strong>Available:</strong> {ticket.availability} tickets</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            min="1"
            max={ticket.availability}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            required
          />
        </div>
        
        <div className="total-price">
          <p><strong>Total Price:</strong> ${(ticket.price * quantity).toFixed(2)}</p>
        </div>
        
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Processing...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
}

export default BookTicket;