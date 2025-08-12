import React from 'react';

const McdaTool = () => (
  <div style={{ width: '100%', height: '80vh', border: '1px solid #ccc', borderRadius: 8, overflow: 'hidden' }}>
    <iframe
      src="https://mcda-analysis.onrender.com/"
      title="MCDA Tool"
      width="100%"
      height="100%"
      style={{ border: 'none', minHeight: '600px' }}
      allowFullScreen
    />
  </div>
);

export default McdaTool;