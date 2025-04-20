import React from 'react';

function Summarize({ Text, onBack }) {
  const handleDownload = () => {
    const blob = new Blob([Text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Summary</h2>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {Text}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Upload
          </button>
          
          <button
            onClick={handleDownload}
            className="btn-primary"
          >
            Download Summary
          </button>
        </div>
      </div>
    </div>
  );
}

export default Summarize;
