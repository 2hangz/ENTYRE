import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';

export default function ConnectedIconNode({ data }) {
  const [hovered, setHovered] = useState(false);

  const iconUrl = data.icon?.startsWith("http")
    ? data.icon
    : `https://entyre-backend.onrender.com${data.icon?.startsWith("/") ? "" : "/"}${data.icon || ""}`;

  const invisibleHandleStyle = {
    background: 'transparent',
    border: 'none',
    opacity: 0,
    width: 10,
    height: 10,
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Handles */}
      {['Top', 'Right', 'Bottom', 'Left'].map(pos => (
        <React.Fragment key={pos}>
          <Handle type="source" position={Position[pos]} id={pos.toLowerCase()} style={invisibleHandleStyle} />
          <Handle type="target" position={Position[pos]} id={pos.toLowerCase()} style={invisibleHandleStyle} />
        </React.Fragment>
      ))}

      <img
        src={iconUrl}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          border: 'none',
          borderRadius: '12px',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.2s',
          cursor: 'pointer'
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onError={e => { e.target.style.display = 'none'; }}
      />
    </div>
  );
}