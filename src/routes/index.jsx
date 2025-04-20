import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Upload from '../pages/Upload';
import Summary from '../pages/Summary';
import Flashcards from '../pages/Flashcards';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Upload />,
      },
      {
        path: 'summary',
        element: <Summary />,
      },
      {
        path: 'flashcards',
        element: <Flashcards />,
      },
    ],
  },
]);
