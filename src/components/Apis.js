// api.js - API service functions
// const API_URL='http://localhost:5000';
const API_URL='https://backend-with-sqlite.vercel.app';

// Helper function for requests
async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, mergedOptions);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Something went wrong'
    }));
    throw new Error(error.message || 'API request failed');
  }
  
  return response.json();
}

// Auth API calls
export const loginUser = (credentials) => {
  return fetchWithAuth('/api/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
};

export const registerUser = (userData) => {
  return fetchWithAuth('/api/users/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};

export const getCurrentUser = () => {
  return fetchWithAuth('/api/users/me');
};

// Events API calls
export const getEvents = () => {
  return fetchWithAuth('/api/events');
};

export const getEventById = (id) => {
  return fetchWithAuth(`/api/events/${id}`);
};

export const createEvent = (eventData) => {
  return fetchWithAuth('/api/events', {
    method: 'POST',
    body: JSON.stringify(eventData)
  });
};

export const updateEvent = (id, eventData) => {
  return fetchWithAuth(`/api/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData)
  });
};

export const deleteEvent = (id) => {
  return fetchWithAuth(`/api/events/${id}`, {
    method: 'DELETE'
  });
};

// Tickets API calls
export const getTickets = () => {
  return fetchWithAuth('/api/tickets');
};

export const getTicketById = (id) => {
  return fetchWithAuth(`/api/tickets/${id}`);
};

export const getTicketsByEventId = (eventId) => {
  return fetchWithAuth(`/api/tickets/event/${eventId}`);
};

// Bookings API calls
export const getUserBookings = () => {
  return fetchWithAuth('/api/bookings');
};

export const getBookingById = (id) => {
  return fetchWithAuth(`/api/bookings/${id}`);
};

export const createBooking = (bookingData) => {
  return fetchWithAuth('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  });
};

export const cancelBooking = (id) => {
  return fetchWithAuth(`/api/bookings/${id}/cancel`, {
    method: 'PATCH'
  });
};

// Admin API calls
export const getAllUsers = () => {
  return fetchWithAuth('/api/admin/users');
};

export const getAllBookings = () => {
  return fetchWithAuth('/api/admin/bookings');
};