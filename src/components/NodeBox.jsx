import React from 'react';

export default function NodeBox({ icon }) {
  return (
    <div
      className="flex items-center justify-center border border-gray-300 rounded-lg shadow bg-white"
      style={{
        width: '100%',
        height: '100%',
        padding: 8,
      }}
    >
      <img src={icon} alt="" className="w-10 h-10" />
    </div>
  );
}