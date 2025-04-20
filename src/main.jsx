import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { PDFProvider } from './context/PDFContext';
import { router } from './routes';
import './index.css';

createRoot(document.getElementById('root')).render(
  <PDFProvider>
    <RouterProvider router={router} />
  </PDFProvider>
);
