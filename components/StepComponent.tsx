
import React from 'react';
import { StepInfo, FormData } from '../types';
import { ArrowLeftIcon, ArrowRightIcon } from './icons';

interface StepProps {
  stepInfo: StepInfo;
  value: string;
  onUpdate: (field: keyof FormData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  isEditing: boolean;
  animationDirection: 'forward' | 'backward';
}

const StepComponent: React.FC<StepProps> = ({
  stepInfo,
  value,
  onUpdate,
  onNext,
  onBack,
  isFirst,
  isLast,
  isEditing,
  animationDirection,
}) => {
  const animationClass = animationDirection === 'forward' ? 'animate-slide-in-left' : 'animate-slide-in-right';

  return (
    <div className={`w-full max-w-2xl mx-auto flex flex-col ${animationClass}`}>
      <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">
        {stepInfo.title}
      </h2>
      <textarea
        className="w-full h-40 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 resize-none"
        placeholder={stepInfo.placeholder}
        value={value}
        onChange={(e) => onUpdate(stepInfo.field, e.target.value)}
      />
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          disabled={isFirst}
          className="px-6 py-2 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          <ArrowLeftIcon />
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {isEditing ? 'Update Summary' : isLast ? 'Review Summary' : 'Next'}
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
};

export default StepComponent;
