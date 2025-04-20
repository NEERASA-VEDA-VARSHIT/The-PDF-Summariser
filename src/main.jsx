import React from 'react';
import ReactDOM from 'react-dom/client';
import { PDFProvider } from './context/PDFContext';
import AppRouter from './routes'; // make sure this is the default export from routes/index.jsx
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PDFProvider>
      <AppRouter />
    </PDFProvider>
  </React.StrictMode>
);
