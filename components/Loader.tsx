
import React from 'react';

const loadingMessages = [
  "Contacting the AI architect...",
  "Weaving pixels and code...",
  "Designing your digital dream...",
  "Generating UI magic...",
  "Compiling creativity...",
];

const Loader: React.FC = () => {
  const [message, setMessage] = React.useState(loadingMessages[0]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = loadingMessages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center animate-fade-in">
      <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300 transition-all duration-500">{message}</p>
    </div>
  );
};

export default Loader;
