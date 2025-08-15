import React from 'react';

const Footer = () => {
  const footerStyle = {
    background: '#003C69', // UCC Crest Blue
    padding: '24px 20px',
    textAlign: 'center',
    color: '#ffffff',
    fontFamily: "'FiraGO', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    fontSize: '16px',
    fontWeight: '500',
    borderTop: '3px solid #FFB500', // UCC Crest Yellow accent
    marginTop: 'auto'
  };

  const linkStyle = {
    color: '#FFB500', // UCC Crest Yellow
    textDecoration: 'none',
    fontWeight: '600',
    margin: '0 8px',
    transition: 'color 0.2s'
  };

  return (
    <footer style={footerStyle}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ margin: '0 0 8px 0' }}>
          ©2025 MaREI x ENTYRE - 
          <a 
            href="https://www.marei.ie" 
            target="_blank" 
            rel="noopener noreferrer"
            style={linkStyle}
            onMouseEnter={(e) => e.target.style.color = '#ED9A22'} // UCC Gold on hover
            onMouseLeave={(e) => e.target.style.color = '#FFB500'}
          >
            MaREI Centre
          </a>
        </p>
        <p style={{ margin: '0', fontSize: '14px', opacity: '0.9' }}>
          Sustainable Energy Research | University College Cork
        </p>
      </div>
    </footer>
  );
};

export default Footer;