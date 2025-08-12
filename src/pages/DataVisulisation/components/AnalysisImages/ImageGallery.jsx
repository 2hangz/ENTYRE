import React, { useState, useEffect } from 'react';
import ImageModal from './ImageModal';
import styles from '../style/MCDA.module.css';

const BASE_IMAGE_API = 'https://entyre-backend.onrender.com';

const ImageGallery = ({ selectedFile, imageType = 'scatter' }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (selectedFile && imageType) {
      loadImages();
    }
    // eslint-disable-next-line
  }, [selectedFile, imageType]);

  const loadImages = async () => {
    setLoading(true);

    const fileName = selectedFile.replace(/\.(xlsx|xls)$/i, '');
    const imageFiles = [
      'Criteria_Weight_Full_Order.png',
      'Criteria_Weight_-_Top_1.png',
      'Criteria_Weight_Normalised_Full_Order.png',
      'Criteria_Weight_Normalised_-_Top_1.png'
    ];

    const imageTypePath = imageType === 'scatter' ? 'scatter_plots' : 'tornado_diagrams';

    const loadedImages = [];
    let loadedCount = 0;

    for (const imageFile of imageFiles) {
      // 使用和后端一致的图片API前缀
      const imagePath = `${BASE_IMAGE_API}/image/${imageTypePath}/${encodeURIComponent(fileName)}/${encodeURIComponent(imageFile)}`;

      try {
        const img = new window.Image();
        img.onload = () => {
          loadedImages.push({
            src: imagePath,
            title: imageFile.replace(/\.(png|jpg|jpeg)$/i, '').replace(/_/g, ' '),
            alt: imageFile,
            loaded: true
          });
          loadedCount++;
          if (loadedCount === imageFiles.length) {
            setImages(loadedImages);
            setLoading(false);
          }
        };

        img.onerror = () => {
          loadedImages.push({
            src: imagePath,
            title: imageFile.replace(/\.(png|jpg|jpeg)$/i, '').replace(/_/g, ' '),
            alt: imageFile,
            loaded: false,
            error: true
          });
          loadedCount++;
          if (loadedCount === imageFiles.length) {
            setImages(loadedImages);
            setLoading(false);
          }
        };

        img.src = imagePath;
      } catch (error) {
        loadedImages.push({
          src: imagePath,
          title: imageFile.replace(/\.(png|jpg|jpeg)$/i, '').replace(/_/g, ' '),
          alt: imageFile,
          loaded: false,
          error: true
        });
        loadedCount++;
        if (loadedCount === imageFiles.length) {
          setImages(loadedImages);
          setLoading(false);
        }
      }
    }
  };

  const handleImageClick = (image) => {
    if (image.loaded && !image.error) {
      setSelectedImage(image);
      setIsModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading images...</p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">No images found</p>
          <p className="text-sm mt-2">Images are generated from the selected Excel file</p>
          <p className="text-xs mt-1 text-gray-400">Run Scatter.py and Tornado.py to generate images</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {images.map((image, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-3 text-center">
            {image.title}
          </h4>

          {image.loaded && !image.error ? (
            <div className="flex justify-center">
              <img
                src={image.src}
                alt={image.alt}
                style={{
                  width: '500px',
                  maxWidth: '40vw',
                  height: 'auto',
                  maxHeight: '20rem',
                  objectFit: 'contain',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
                className="shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => handleImageClick(image)}
                title="Click to enlarge"
              />
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <div className="text-sm">Image not found</div>
              <div className="text-xs mt-1 break-all">Path: {image.src}</div>
            </div>
          )}
        </div>
      ))}

      <ImageModal
        isOpen={isModalOpen}
        image={selectedImage}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ImageGallery;
