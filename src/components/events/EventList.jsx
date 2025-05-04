// // components/events/EventList.js - List of events
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { getEvents } from '../Apis';

// function EventList() {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
  
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const data = await getEvents();
//         setEvents(data);
//       } catch (err) {
//         setError('Failed to load events');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchEvents();
//   }, []);
  
//   if (loading) {
//     return <div className="loading">Loading events...</div>;
//   }
  
//   if (error) {
//     return <div className="error-message">{error}</div>;
//   }
  
//   return (
//     <div className="event-list-container">
//       <h2>Upcoming Events</h2>
      
//       {events.length === 0 ? (
//         <p>No events available at the moment.</p>
//       ) : (
//         <div className="event-grid">
//           {events.map(event => (
//             <div key={event.id} className="event-card">
//               <h3>{event.name}</h3>
//               <p className="event-date">Date: {new Date(event.date).toLocaleDateString()}</p>
//               <p className="event-location">Location: {event.location}</p>
              
//               {event.tickets && event.tickets.length > 0 && (
//                 <p className="event-price">
//                   From ${Math.min(...event.tickets.map(ticket => ticket.price))}
//                 </p>
//               )}
              
//               <Link to={`/events/${event.id}`} className="btn-secondary">
//                 View Details
//               </Link>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default EventList;


// components/events/EventList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../Apis';

// 🔹 Helper function to generate map iframe
const getLocationMapIframe = (locationName) => {
  const encodedLocation = encodeURIComponent(locationName);
  return `<iframe 
    src="https://maps.google.com/maps?q=${encodedLocation}&t=&z=13&ie=UTF8&iwloc=&output=embed" 
    width="100%" 
    height="150" 
    frameBorder="0" 
    scrolling="no" 
    marginHeight="0" 
    marginWidth="0"
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade">
  </iframe>`;
};

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError('Failed to load events');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="event-list-container">
      <h2>Upcoming Events</h2>

      {events.length === 0 ? (
        <p>No events available at the moment.</p>
      ) : (
        <div className="event-grid">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <h3>{event.name}</h3>
              <p className="event-date">Date: {new Date(event.date).toLocaleDateString()}</p>
              <p className="event-location">Location: {event.location}</p>

              {/* 🌍 Map preview */}
              <div className="map-preview" style={{ margin: '10px 0' }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: getLocationMapIframe(event.location)
                  }}
                />
              </div>

              {event.tickets && event.tickets.length > 0 && (
                <p className="event-price">
                  From £{Math.min(...event.tickets.map(ticket => ticket.price))}
                </p>
              )}

              <Link to={`/events/${event.id}`} className="btn-secondary">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventList;
