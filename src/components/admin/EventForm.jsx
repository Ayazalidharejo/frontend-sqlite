// components/admin/EventForm.js - Create/Edit events
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createEvent, getEventById, updateEvent } from '../Apis';

function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    tickets: [
      { ticketType: 'General Admission', price: 0, availability: 10 }
    ]
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (isEditMode) {
      const fetchEvent = async () => {
        try {
          const data = await getEventById(id);
          
          // Format date for input field
          const eventDate = new Date(data.date);
          const formattedDate = eventDate.toISOString().split('T')[0];
          
          setFormData({
            name: data.name,
            description: data.description,
            date: formattedDate,
            location: data.location,
            tickets: data.tickets || []
          });
        } catch (err) {
          setError('Failed to load event details');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchEvent();
    }
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...formData.tickets];
    updatedTickets[index] = {
      ...updatedTickets[index],
      [field]: field === 'price' || field === 'availability' ? Number(value) : value
    };
    
    setFormData({
      ...formData,
      tickets: updatedTickets
    });
  };
  
  const addTicket = () => {
    setFormData({
      ...formData,
      tickets: [
        ...formData.tickets,
        { ticketType: '', price: 0, availability: 10 }
      ]
    });
  };
  
  const removeTicket = (index) => {
    const updatedTickets = formData.tickets.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      tickets: updatedTickets
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      if (isEditMode) {
        await updateEvent(id, formData);
      } else {
        await createEvent(formData);
      }
      
      navigate('/');
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} event`);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Loading event details...</div>;
  }
  
  return (
    <div className="event-form-container">
      <h2>{isEditMode ? 'Edit Event' : 'Create New Event'}</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Event Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="tickets-section">
          <h3>Tickets</h3>
          
          {formData.tickets.map((ticket, index) => (
            <div key={index} className="ticket-form-item">
              <div className="form-group">
                <label>Ticket Type</label>
                <input
                  type="text"
                  value={ticket.ticketType}
                  onChange={(e) => handleTicketChange(index, 'ticketType', e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Price (£)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={ticket.price}
                  onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Quantity Available</label>
                <input
                  type="number"
                  min="1"
                  value={ticket.availability}
                  onChange={(e) => handleTicketChange(index, 'availability', e.target.value)}
                  required
                />
              </div>
              
              {formData.tickets.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTicket(index)}
                  className="btn-danger btn-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={addTicket}
            className="btn-secondary"
          >
            Add Ticket Type
          </button>
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : isEditMode ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventForm;