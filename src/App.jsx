import { useState, useCallback } from 'react';
import Summarize from './Summarize';
import Flashcard from './Flashcard';
import ErrorBoundary from './components/ErrorBoundary';
import { extractTextFromPDF } from './services/fileProcessor';
import { processText } from './services/gemini';

function App() {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'summary', 'flashcards'
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
    if (!file) return;

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
      setActiveTab('summary');
    } catch (error) {
      console.error('Processing error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [file, flashcardCount, flashcardTopic, summaryDepth]);

  const renderUploadSection = () => (
    <div className="max-w-3xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload PDF</h2>
        <p className="text-gray-600 mb-6">
          *PDF files up to 10MB are supported. Daily limit: 10 files.
        </p>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
            <input
              type="file"
              accept=".pdf"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              onChange={handleFileChange}
              disabled={isLoading}
            />

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Number of Flashcards:
                </label>
                <input
                  type="number"
                  value={flashcardCount}
                  onChange={(e) => setFlashcardCount(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="1"
                  max="20"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Flashcard Topic (optional):
                </label>
                <input
                  type="text"
                  value={flashcardTopic}
                  onChange={(e) => setFlashcardTopic(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter a specific topic"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Summary Detail Level:
                </label>
                <select
                  value={summaryDepth}
                  onChange={(e) => setSummaryDepth(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="Concise">Concise</option>
                  <option value="Detailed">Detailed</option>
                  <option value="In-Depth">In-Depth</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary w-full"
              onClick={handleFileUpload}
              disabled={isLoading || !file}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                  Processing...
                </div>
              ) : (
                'Process PDF'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen pb-12">
        {/* Header */}
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

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-2 rounded-lg font-medium transition-all
                ${activeTab === 'upload'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Upload
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-6 py-2 rounded-lg font-medium transition-all
                ${activeTab === 'summary'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              disabled={!fileContent}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-6 py-2 rounded-lg font-medium transition-all
                ${activeTab === 'flashcards'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              disabled={!flashcardData.length}
            >
              Flashcards
            </button>
          </div>

          {error && (
            <div className="max-w-3xl mx-auto mb-8">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {activeTab === 'upload' && renderUploadSection()}
          {activeTab === 'summary' && fileContent && (
            <Summarize Text={fileContent} onBack={() => setActiveTab('upload')} />
          )}
          {activeTab === 'flashcards' && flashcardData.length > 0 && (
            <Flashcard flashcards={flashcardData} onBack={() => setActiveTab('upload')} />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;