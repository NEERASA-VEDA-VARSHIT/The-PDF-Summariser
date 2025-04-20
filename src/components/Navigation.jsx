import { NavLink } from 'react-router-dom';
import { usePDF } from '../context/PDFContext';

function Navigation() {
  const { fileContent, flashcardData } = usePDF();

  return (
    <nav className="max-w-7xl mx-auto px-4 mb-8">
      <div className="flex justify-center space-x-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-6 py-2 rounded-lg font-medium transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`
          }
        >
          Upload
        </NavLink>
        
        <NavLink
          to="/summary"
          className={({ isActive }) =>
            `px-6 py-2 rounded-lg font-medium transition-all ${
              !fileContent
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isActive
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`
          }
          onClick={(e) => {
            if (!fileContent) {
              e.preventDefault();
              alert('Please upload a PDF file before viewing the summary.');
            }
          }}
        >
          Summary
        </NavLink>
        
        <NavLink
          to="/flashcards"
          className={({ isActive }) =>
            `px-6 py-2 rounded-lg font-medium transition-all ${
              !flashcardData.length
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isActive
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`
          }
          onClick={(e) => {
            if (!flashcardData.length) {
              e.preventDefault();
              alert('Please generate flashcards by uploading a PDF file first.');
            }
          }}
        >
          Flashcards
        </NavLink>
      </div>
    </nav>
  );
}

export default Navigation;
