import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';

export default function IconNode({ data }) {
    const [hovered, setHovered] = useState(false);

    const invisibleHandleStyle = {
        background: 'transparent',
        border: 'none',
        opacity: 0,
        width: 10,
        height: 10,
      };

    return (
        <div 
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
        }}>
        
      {/* Top handles */}
      <Handle type="source" position={Position.Top} id="top" style={invisibleHandleStyle} />
      <Handle type="target" position={Position.Top} id="top" style={invisibleHandleStyle} />
      {/* Right handles */}
      <Handle type="source" position={Position.Right} id="right" style={invisibleHandleStyle} />
      <Handle type="target" position={Position.Right} id="right" style={invisibleHandleStyle} />
      {/* Bottom handles */}
      <Handle type="source" position={Position.Bottom} id="bottom" style={invisibleHandleStyle} />
      <Handle type="target" position={Position.Bottom} id="bottom" style={invisibleHandleStyle} />
      {/* Left handles */}
      <Handle type="source" position={Position.Left} id="left" style={invisibleHandleStyle} />
      <Handle type="target" position={Position.Left} id="left" style={invisibleHandleStyle} />
      <img
        src={import.meta.env.BASE_URL + data.icon}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          border: 'none',
          borderRadius: '12px',
          boxSizing: 'border-box',
          transition: 'transform 0.2s cubic-bezier(.4,2,.6,1)',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          cursor: 'pointer',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
    </div>
  );
}