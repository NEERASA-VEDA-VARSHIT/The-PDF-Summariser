import { useNavigate } from 'react-router-dom';
import { usePDF } from '../context/PDFContext';
import Summarize from '../Summarize';

function Summary() {
  const navigate = useNavigate();
  const { fileContent } = usePDF();

  if (!fileContent) {
    navigate('/');
    return null;
  }

  return <Summarize Text={fileContent} onBack={() => navigate('/')} />;
}

export default Summary;
