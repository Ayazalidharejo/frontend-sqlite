// components/common/Footer.js - Footer component
import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Ticket Booking System</p>
    </footer>
  );
}

export default Footer;