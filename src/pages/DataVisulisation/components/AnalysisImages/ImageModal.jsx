import React from 'react';
import styles from '../style/MCDA.module.css';

const ImageModal = ({ isOpen, image, onClose }) => {
  if (!isOpen || !image) {
    return null;
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
          aria-label="Close modal"
        >
          ×
        </button>
        
        {/* Modal content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            {image.title}
          </h3>
          <div className="flex justify-center">
            <img
              src={image.src}
              alt={image.alt}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
