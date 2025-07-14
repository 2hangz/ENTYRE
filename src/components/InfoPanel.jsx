import React from 'react';

export default function InfoPanel({ label, detail, onClose }) {
  return (
    <div className="fixed right-4 top-4 w-72 bg-white border shadow-xl p-4 rounded-xl">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-lg">{label}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
      </div>
      <p className="text-sm text-gray-700">{detail}</p>
    </div>
  );
}