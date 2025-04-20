import { createContext, useContext, useState, useCallback } from 'react';

const PDFContext = createContext();

export function PDFProvider({ children }) {
  const [fileContent, setFileContent] = useState('');
  const [flashcardData, setFlashcardData] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [flashcardCount, setFlashcardCount] = useState(5);
  const [flashcardTopic, setFlashcardTopic] = useState('');
  const [summaryDepth, setSummaryDepth] = useState('Detailed');

  const clearState = useCallback(() => {
    setFileContent('');
    setFlashcardData([]);
    setFile(null);
    setError(null);
  }, []);

  const value = {
    fileContent,
    setFileContent,
    flashcardData,
    setFlashcardData,
    file,
    setFile,
    isLoading,
    setIsLoading,
    error,
    setError,
    flashcardCount,
    setFlashcardCount,
    flashcardTopic,
    setFlashcardTopic,
    summaryDepth,
    setSummaryDepth,
    clearState,
  };

  return <PDFContext.Provider value={value}>{children}</PDFContext.Provider>;
}

export function usePDF() {
  const context = useContext(PDFContext);
  if (!context) {
    throw new Error('usePDF must be used within a PDFProvider');
  }
  return context;
}
