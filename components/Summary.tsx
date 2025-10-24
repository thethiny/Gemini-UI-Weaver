
import React from 'react';
import { FormData } from '../types';
import { STEPS } from '../constants';
import { EditIcon, SparklesIcon } from './icons';

interface SummaryProps {
  formData: FormData;
  onEdit: (stepIndex: number) => void;
  onGeneratePreview: () => void;
  onUpdate: (field: keyof FormData, value: string) => void;
}

const Summary: React.FC<SummaryProps> = ({ formData, onEdit, onGeneratePreview, onUpdate }) => {
  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-8">Confirm Your Choices</h2>
      <div className="space-y-6">
        {STEPS.map((step, index) => (
          <div key={step.id} className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">{step.title}</h3>
              <p className="text-gray-800 dark:text-white mt-2">{formData[step.field] || 'Not provided'}</p>
            </div>
            <button
              onClick={() => onEdit(index)}
              className="p-2 text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label={`Edit ${step.field}`}
            >
              <EditIcon />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Extra Details (Optional)</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3">Add any other specific instructions or details for the AI to consider.</p>
          <textarea
            className="w-full h-28 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 resize-none"
            placeholder="e.g., Use a serif font for headings, ensure all components have high contrast for accessibility, add a search bar in the header..."
            value={formData.extraDetails || ''}
            onChange={(e) => onUpdate('extraDetails', e.target.value)}
          />
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={onGeneratePreview}
          className="px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center gap-3 mx-auto"
        >
          <SparklesIcon />
          Generate AI Preview
        </button>
      </div>
    </div>
  );
};

export default Summary;
