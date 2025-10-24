
import React, { useState, useCallback } from 'react';
import { FormData, PreviewData, AppStep } from './types';
import { STEPS } from './constants';
import StepComponent from './components/StepComponent';
import Summary from './components/Summary';
import Preview from './components/Preview';
import Result from './components/Result';
import Loader from './components/Loader';
import { generateLayoutAndImagePrompt, generateImagePreview, generateFinalCode, refineFinalCode } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.Form);
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    description: '',
    theme: '',
    responsiveness: '',
    extraDetails: '',
  });
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [finalCode, setFinalCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward'>('forward');

  const handleUpdate = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (isEditing) {
      setIsEditing(false);
      setStep(AppStep.Summary);
      return;
    }

    if (formStep < STEPS.length - 1) {
      setAnimationDirection('forward');
      setFormStep(formStep + 1);
    } else {
      setStep(AppStep.Summary);
    }
  };

  const handleBack = () => {
    if (formStep > 0) {
      setAnimationDirection('backward');
      setFormStep(formStep - 1);
    }
  };
  
  const handleEdit = (stepIndex: number) => {
    setIsEditing(true);
    setAnimationDirection('backward');
    setFormStep(stepIndex);
    setStep(AppStep.Form);
  };

  const handleGeneratePreview = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const layoutData = await generateLayoutAndImagePrompt(formData);
      const imageData = await generateImagePreview(layoutData.imagePrompt);
      setPreviewData({
        layoutDescription: layoutData.layoutDescription,
        imageUrls: imageData.base64s.map(b64 => `data:image/png;base64,${b64}`),
        imageBase64s: imageData.base64s,
      });
      setStep(AppStep.Preview);
    } catch (err) {
      setError('Failed to generate preview. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  const handleGenerateCode = useCallback(async (selectedImageIndex: number) => {
    if (!previewData) return;
    setIsLoading(true);
    setError(null);
    try {
      // Use the selected image for code generation.
      const code = await generateFinalCode(formData, previewData.layoutDescription, previewData.imageBase64s[selectedImageIndex]);
      setFinalCode(code);
      setStep(AppStep.Result);
    } catch (err) {
      setError('Failed to generate code. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [formData, previewData]);

  const handleRefineCode = useCallback(async (instruction: string) => {
    if (!finalCode) return;
    setIsLoading(true);
    setError(null);
    try {
      const refinedCode = await refineFinalCode(finalCode, instruction);
      setFinalCode(refinedCode);
    } catch (err) {
      setError('Failed to refine code. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [finalCode]);

  const handleStartOver = () => {
    setStep(AppStep.Form);
    setFormStep(0);
    setFormData({ description: '', theme: '', responsiveness: '', extraDetails: '' });
    setPreviewData(null);
    setFinalCode(null);
    setError(null);
    setIsEditing(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }

    switch (step) {
      case AppStep.Form:
        return (
          <StepComponent
            key={formStep}
            stepInfo={STEPS[formStep]}
            value={formData[STEPS[formStep].field]}
            onUpdate={handleUpdate}
            onNext={handleNext}
            onBack={handleBack}
            isFirst={formStep === 0}
            isLast={formStep === STEPS.length - 1}
            isEditing={isEditing}
            animationDirection={animationDirection}
          />
        );
      case AppStep.Summary:
        return (
          <Summary
            formData={formData}
            onUpdate={handleUpdate}
            onEdit={handleEdit}
            onGeneratePreview={handleGeneratePreview}
          />
        );
      case AppStep.Preview:
        return (
          previewData && (
            <Preview
              previewData={previewData}
              onContinue={handleGenerateCode}
              onBack={() => setStep(AppStep.Summary)}
              onRegenerate={handleGeneratePreview}
            />
          )
        );
      case AppStep.Result:
        return (
          finalCode && <Result code={finalCode} onStartOver={handleStartOver} onRefineCode={handleRefineCode} />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center ${step !== AppStep.Result ? 'justify-center' : 'justify-start'} p-4 transition-colors duration-500`}>
       <div className={`w-full transition-all duration-500 ${step === AppStep.Result ? 'max-w-full flex-1 flex flex-col' : 'max-w-4xl'}`}>
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">
            Gemini UI Weaver
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Design and generate your web UI in a few easy steps.
          </p>
        </header>
        <main className={`relative w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ${step === AppStep.Result ? 'flex-1 p-2 md:p-4 flex flex-col' : 'min-h-[500px] p-6 md:p-10 flex items-center justify-center'}`}>
          {error && (
            <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-20" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
