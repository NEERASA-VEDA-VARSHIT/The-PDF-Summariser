import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Upload from '../pages/Upload';
import Summary from '../pages/Summary';
import Flashcards from '../pages/Flashcards';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Upload />} />
          <Route path="summary" element={<Summary />} />
          <Route path="flashcards" element={<Flashcards />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
