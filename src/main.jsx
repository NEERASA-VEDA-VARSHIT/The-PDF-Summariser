import ReactDOM from 'react-dom/client';
import { PDFProvider } from './context/PDFContext';
import AppRouter from './routes';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <PDFProvider>
      <AppRouter />
    </PDFProvider>
);
