import { useState, useCallback } from "react";
import Summarize from "./Summarize";
import Flashcard from "./Flashcard";
import ErrorBoundary from "./components/ErrorBoundary";
import { extractTextFromPDF } from './services/fileProcessor';
 import { processText } from './services/gemini';

function App() {
  const [isSummarized, setIsSummarized] = useState(false);
  const [showFlashCards, setShowFlashCards] = useState(false);
  const [fileContent, setFileContent] = useState("");
  const [flashcardData, setFlashcardData] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Options state
  const [flashcardCount, setFlashcardCount] = useState(5);
  const [flashcardTopic, setFlashcardTopic] = useState("");
  const [summaryDepth, setSummaryDepth] = useState("Detailed");

  const handleSummarizeClick = useCallback((e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a file first.");
      return;
    }
    setIsSummarized(true);
    setShowFlashCards(false);
  }, [file]);

  const handleGenerateFlashCardsClick = useCallback((e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a file first.");
      return;
    }
    setShowFlashCards(true);
    setIsSummarized(false);
  }, [file]);

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Reset previous results when a new file is selected
      setFileContent("");
      setFlashcardData([]);
      setError(null);
    }
  }, []);

  const handleFileUpload = useCallback(async () => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Extract text from PDF
      const text = await extractTextFromPDF(file);
      const txtFile = createTextFile(text);
      
      // Process with Gemini API
      const result = await processWithGemini(await txtFile.text(), {
        flashcardCount,
        flashcardTopic,
        summaryDepth
      });
      
      setFileContent(result.summary);
      setFlashcardData(result.flashcards);
      setIsSummarized(true);
    } catch (error) {
      console.error("Processing error:", error);
      setError(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [file, flashcardCount, flashcardTopic, summaryDepth]);

  return (
    <ErrorBoundary>
      <div className="relative bg-gradient-to-r from-blue-500 to-blue-700 py-16">
        <div className="absolute inset-0 flex justify-center items-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold text-center">
            Your PDF Summarizer
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <header className="text-center mb-8">
          <h2 className="text-lg font-medium text-gray-700">
            Upload your PDF file
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            *Only PDF files are supported
          </p>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="file"
              accept=".pdf"
              className="border-2 border-gray-300 p-3 rounded-md w-full md:w-2/3 text-gray-700"
              id="pdf-upload"
              onChange={handleFileChange}
              disabled={isLoading}
              aria-label="Upload PDF file"
            />
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
              onClick={handleFileUpload}
              disabled={isLoading || !file}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="inline-block mr-2 animate-spin">⟳</span>
                  Processing...
                </>
              ) : "Upload"}
            </button>
          </form>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="flashcardCount" className="block text-gray-700">
                Number of Flashcards:
              </label>
              <input
                type="number"
                id="flashcardCount"
                value={flashcardCount}
                onChange={(e) => setFlashcardCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="border rounded p-2 w-full"
                min="1"
                disabled={isLoading}
                aria-label="Number of flashcards to generate"
              />
            </div>
            <div>
              <label htmlFor="flashcardTopic" className="block text-gray-700">
                Flashcard Topic (optional):
              </label>
              <input
                type="text"
                id="flashcardTopic"
                value={flashcardTopic}
                onChange={(e) => setFlashcardTopic(e.target.value)}
                className="border rounded p-2 w-full"
                placeholder="Enter a specific topic"
                disabled={isLoading}
                aria-label="Flashcard topic"
              />
            </div>
            <div>
              <label htmlFor="summaryDepth" className="block text-gray-700">
                Summary Detail/Depth:
              </label>
              <select
                id="summaryDepth"
                value={summaryDepth}
                onChange={(e) => setSummaryDepth(e.target.value)}
                className="border rounded p-2 w-full"
                disabled={isLoading}
                aria-label="Summary detail level"
              >
                <option value="Concise">Concise</option>
                <option value="Detailed">Detailed</option>
                <option value="In-Depth">In-Depth</option>
                <option value="Comprehensive">Comprehensive</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center mt-6 gap-4">
            <button
              onClick={handleSummarizeClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
              disabled={isLoading || !fileContent}
              aria-label="Show summary"
            >
              Summarize PDF
            </button>
            <button
              onClick={handleGenerateFlashCardsClick}
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200"
              disabled={isLoading || flashcardData.length === 0}
              aria-label="Show flashcards"
            >
              Generate Flash Cards
            </button>
          </div>
        </header>

        {isLoading && (
          <div className="mt-4 flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            <p className="text-gray-500 mt-2" aria-live="polite">Processing your document with Gemini...</p>
          </div>
        )}
          
        {error && (
          <div className="mt-4 text-red-500 bg-red-50 p-3 rounded border border-red-200" role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}

        {isSummarized && <Summarize Text={fileContent} />}

        {showFlashCards && <Flashcard flashcards={flashcardData} />}
      </div>
    </ErrorBoundary>
  );
}

export default App;
