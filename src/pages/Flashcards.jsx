import { useNavigate } from 'react-router-dom';
import { usePDF } from '../context/PDFContext';
import Flashcard from '../Flashcard';

function Flashcards() {
  const navigate = useNavigate();
  const { flashcardData } = usePDF();

  if (!flashcardData.length) {
    navigate('/');
    return null;
  }

  return <Flashcard flashcards={flashcardData} onBack={() => navigate('/')} />;
}

export default Flashcards;
