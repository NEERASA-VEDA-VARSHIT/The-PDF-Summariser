import React, { Suspense, lazy, useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from './components/ErrorBoundary';
import { extractTextFromPDF } from './services/fileProcessor';
import { processText } from './services/gemini';

// Lazy loaded components
const Summarize = lazy(() => import("./components/Summarize"));
const Flashcard = lazy(() => import("./components/Flashcard"));
const Upload = lazy(() => import("./components/Upload")); 

function App() {
  const [fileContent, setFileContent] = useState('');
  const [flashcardData, setFlashcardData] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [flashcardCount, setFlashcardCount] = useState(5);
  const [flashcardTopic, setFlashcardTopic] = useState('');
  const [summaryDepth, setSummaryDepth] = useState('Detailed');

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  }, []);

  const handleFileUpload = useCallback(async () => {
    if (!file) {
      alert('Please upload a PDF file before proceeding.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const txtFile = await extractTextFromPDF(file);
      const fileContent = await txtFile.text();
      
      const result = await processText(fileContent, {
        flashcardCount,
        flashcardTopic,
        summaryDepth,
      });

      setFileContent(result.summary);
      setFlashcardData(result.flashcards);
    } catch (error) {
      console.error('Processing error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [file, flashcardCount, flashcardTopic, summaryDepth]);

  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="min-h-screen pb-12">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12 mb-12">
              <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
                  PDF Processor
                </h1>
                <p className="text-blue-100 text-center text-lg">
                  Summarize PDFs and Create Flashcards
                </p>
              </div>
            </div>

            <Routes>
              <Route
                path="/"
                element={
                  <Upload
                    isLoading={isLoading}
                    error={error}
                    fileContent={fileContent}
                    flashcardData={flashcardData}
                    flashcardCount={flashcardCount}
                    flashcardTopic={flashcardTopic}
                    summaryDepth={summaryDepth}
                    setFlashcardCount={setFlashcardCount}
                    setFlashcardTopic={setFlashcardTopic}
                    setSummaryDepth={setSummaryDepth}
                    handleFileChange={handleFileChange}
                    handleFileUpload={handleFileUpload}
                  />
                }
              />
              <Route
                path="/summary"
                element={
                  fileContent ? (
                    <Summarize Text={fileContent} />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/flashcards"
                element={
                  flashcardData.length > 0 ? (
                    <Flashcard flashcards={flashcardData} />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
            </Routes>
          </div>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
