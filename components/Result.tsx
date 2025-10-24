
import React, { useState } from 'react';
import { DownloadIcon, RefreshIcon, SparklesIcon } from './icons';

interface ResultProps {
  code: string;
  onStartOver: () => void;
  onRefineCode: (instruction: string) => void;
}

const Result: React.FC<ResultProps> = ({ code, onStartOver, onRefineCode }) => {
  const [refinementInstruction, setRefinementInstruction] = useState('');

  const downloadHtmlFile = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gemini-ui.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRefineClick = () => {
    if (refinementInstruction.trim()) {
      onRefineCode(refinementInstruction);
      setRefinementInstruction('');
    }
  };

  return (
    <div className="w-full h-full flex flex-col animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-4">Your UI is Ready!</h2>
      <div className="flex-grow border-4 border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
        <iframe
          srcDoc={code}
          title="Generated UI Preview"
          className="w-full h-full"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>

      {/* Refinement Section */}
      <div className="w-full max-w-4xl mx-auto mt-6">
        <div className="bg-gray-100 dark:bg-gray-800/50 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-center mb-2">Want to make a change?</h3>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">Describe your desired edit, and the AI will refine the code.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <textarea
              value={refinementInstruction}
              onChange={(e) => setRefinementInstruction(e.target.value)}
              placeholder="e.g., 'Make the header sticky' or 'Change the chart to a bar chart.'"
              className="w-full flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 transition duration-300 resize-none"
              rows={2}
              aria-label="Refinement instructions"
            />
            <button
              onClick={handleRefineClick}
              disabled={!refinementInstruction.trim()}
              className="px-6 py-2 text-base font-medium text-white bg-teal-600 border border-transparent rounded-lg shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 sm:py-0"
            >
              <SparklesIcon />
              Refine
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={onStartOver}
          className="px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center gap-2"
        >
          <RefreshIcon />
          Start Over
        </button>
        <button
          onClick={downloadHtmlFile}
          className="px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center gap-2"
        >
          <DownloadIcon />
          Download Code
        </button>
      </div>
    </div>
  );
};

export default Result;
