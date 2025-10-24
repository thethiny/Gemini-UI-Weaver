
import React, { useState } from 'react';
import { PreviewData } from '../types';
import { ArrowLeftIcon, CheckIcon, RefreshIcon } from './icons';

interface PreviewProps {
  previewData: PreviewData;
  onContinue: (selectedImageIndex: number) => void;
  onBack: () => void;
  onRegenerate: () => void;
}

const Preview: React.FC<PreviewProps> = ({ previewData, onContinue, onBack, onRegenerate }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const Lightbox = ({ imageUrl, onClose }: { imageUrl: string, onClose: () => void }) => (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <img 
        src={imageUrl} 
        alt="Full size preview" 
        className="max-w-[95vw] max-h-[95vh] object-contain rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking on the image
      />
      <button 
        className="absolute top-4 right-4 text-white text-3xl font-bold"
        onClick={onClose}
        aria-label="Close full-size preview"
      >
        &times;
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      {selectedImage && <Lightbox imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}
      <h2 className="text-3xl font-bold text-center mb-6">AI Generated Preview</h2>
      <div className="space-y-8">
        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Layout Description</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{previewData.layoutDescription}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4 text-center">Visual Concepts (Click to Enlarge)</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {previewData.imageUrls.map((url, index) => (
               <div key={index} className="relative rounded-lg shadow-lg overflow-hidden border-4 border-gray-200 dark:border-gray-600 group">
                <img 
                  src={url} 
                  alt={`AI Generated UI Preview ${index + 1}`} 
                  className="w-full h-auto object-cover cursor-pointer" 
                  onClick={() => setSelectedImage(url)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                  <button
                    onClick={() => onContinue(index)}
                    className="px-6 py-2 text-base font-medium text-white bg-green-600 border border-transparent rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all flex items-center gap-2"
                  >
                    <CheckIcon />
                    Choose This Design
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-10">
        <div className="flex gap-4">
            <button
              onClick={onBack}
              className="px-6 py-2 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center gap-2"
            >
              <ArrowLeftIcon />
              Back to Summary
            </button>
            <button
              onClick={onRegenerate}
              className="px-6 py-2 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center gap-2"
            >
              <RefreshIcon />
              Regenerate
            </button>
        </div>
      </div>
    </div>
  );
};

export default Preview;
