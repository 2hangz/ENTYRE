import React from 'react';

export default function CustomPolylineEdge({
  id, sourceX, sourceY, targetX, targetY, style = {}, markerEnd
}) {
    
  const offset = 30;
  const points = [
    [sourceX, sourceY],
    [sourceX, sourceY + offset],
    [targetX, sourceY + offset],
    [targetX, targetY]
  ];
  const path = `M${points[0][0]},${points[0][1]} L${points[1][0]},${points[1][1]} L${points[2][0]},${points[2][1]} L${points[3][0]},${points[3][1]}`;

  return (
    <path
      id={id}
      style={style}
      className="react-flow__edge-path"
      d={path}
      markerEnd={markerEnd}
    />
  );
}