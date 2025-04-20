import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePDF } from '../context/PDFContext';
import { extractTextFromPDF } from '../services/fileProcessor';
import { processText } from '../services/gemini';
import ThemeToggle from '../components/ThemeToggle';

function Upload() {
  const navigate = useNavigate();
  const {
    file,
    setFile,
    setFileContent,
    setFlashcardData,
    isLoading,
    setIsLoading,
    error,
    setError,
    flashcardCount,
    flashcardTopic,
    summaryDepth,
    setFlashcardCount,
    setFlashcardTopic,
    setSummaryDepth,
  } = usePDF();

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  }, [setFile, setError]);

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
      navigate('/summary');
    } catch (error) {
      console.error('Processing error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [file, flashcardCount, flashcardTopic, summaryDepth, navigate, setFileContent, setFlashcardData, setIsLoading, setError]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="feature-card">
          <h3 className="text-xl font-semibold text-primary-500 dark:text-primary-400 mb-3">
            Quick Summaries
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Transform lengthy PDFs into concise, easy-to-understand summaries in seconds.
          </p>
        </div>
        <div className="feature-card">
          <h3 className="text-xl font-semibold text-primary-500 dark:text-primary-400 mb-3">
            Smart Flashcards
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Automatically generate study cards from your documents for effective learning.
          </p>
        </div>
        <div className="feature-card">
          <h3 className="text-xl font-semibold text-primary-500 dark:text-primary-400 mb-3">
            AI-Powered
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Utilizing advanced AI to extract and organize key information from your PDFs.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Upload Your PDF
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Transform your PDF documents into interactive summaries and flashcards. 
            Perfect for students, researchers, and professionals.
          </p>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-6">
              <div className="border-2 border-dashed border-primary-200 dark:border-primary-700 
                            rounded-xl p-8 text-center hover:border-primary-400 
                            dark:hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  id="pdf-upload"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
                <label 
                  htmlFor="pdf-upload" 
                  className="cursor-pointer block"
                >
                  <div className="text-primary-500 dark:text-primary-400 mb-3">
                    {file ? file.name : 'Drop your PDF here or click to browse'}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    *PDF files up to 10MB are supported. Daily limit: 10 files.
                  </p>
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                    Number of Flashcards
                  </label>
                  <input
                    type="number"
                    value={flashcardCount}
                    onChange={(e) => setFlashcardCount(Number(e.target.value))}
                    className="input-field"
                    min="1"
                    max="20"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                    Flashcard Topic (optional)
                  </label>
                  <input
                    type="text"
                    value={flashcardTopic}
                    onChange={(e) => setFlashcardTopic(e.target.value)}
                    className="input-field"
                    placeholder="Enter a specific topic"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                  Summary Detail Level
                </label>
                <select
                  value={summaryDepth}
                  onChange={(e) => setSummaryDepth(e.target.value)}
                  className="input-field"
                >
                  <option value="Concise">Concise</option>
                  <option value="Detailed">Detailed</option>
                  <option value="In-Depth">In-Depth</option>
                </select>
              </div>

              <button
                type="button"
                className="btn-primary w-full"
                onClick={handleFileUpload}
                disabled={isLoading}
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

          {error && (
            <div className="mt-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 dark:bg-primary-900/50 w-12 h-12 rounded-full 
                          flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 dark:text-primary-400 font-bold text-xl">1</span>
            </div>
            <h3 className="font-semibold mb-2 dark:text-gray-200">Upload PDF</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Select your PDF document and customize processing options
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 dark:bg-primary-900/50 w-12 h-12 rounded-full 
                          flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 dark:text-primary-400 font-bold text-xl">2</span>
            </div>
            <h3 className="font-semibold mb-2 dark:text-gray-200">AI Processing</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our AI analyzes and extracts key information
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 dark:bg-primary-900/50 w-12 h-12 rounded-full 
                          flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 dark:text-primary-400 font-bold text-xl">3</span>
            </div>
            <h3 className="font-semibold mb-2 dark:text-gray-200">Get Results</h3>
            <p className="text-gray-600 dark:text-gray-400">
              View your summary and study with flashcards
            </p>
          </div>
        </div>
      </div>

      <ThemeToggle />
    </div>
  );
}

export default Upload;
