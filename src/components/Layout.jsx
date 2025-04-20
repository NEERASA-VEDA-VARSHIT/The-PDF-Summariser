import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from '../Footer';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
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
      
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 mb-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
