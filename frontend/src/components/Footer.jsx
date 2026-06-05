import React from 'react';

const Footer = () => {
  return (
    <footer style={{ 
      borderTop: '1px solid var(--glass-border)', 
      background: 'rgba(11, 15, 25, 0.5)',
      padding: '2.5rem 0',
      marginTop: 'auto',
      color: 'var(--text-muted)',
      fontSize: '0.85rem'
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '1rem',
        textAlign: 'center'
      }}>
        <div style={{ fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
          AEROSTORE E-COMMERCE
        </div>
        <p style={{ maxWidth: '500px', lineHeight: '1.6' }}>
          A production-ready full-stack shopping application built using React, Express, MongoDB, and JWT authentication. Developed for the CodeAlpha Software Architecture Internship.
        </p>
        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
          &copy; {new Date().getFullYear()} AeroStore. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
