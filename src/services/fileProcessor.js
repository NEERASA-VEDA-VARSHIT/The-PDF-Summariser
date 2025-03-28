import pdfToText from 'react-pdftotext';

// Increased file size limit to 10MB
const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '10485760', 10);
const MAX_DAILY_FILES = 10;

// Store processed files count in localStorage
const STORAGE_KEY = 'pdf_processor_daily';

function getDailyStats() {
  const today = new Date().toISOString().split('T')[0];
  const stats = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  
  if (stats.date !== today) {
    return { date: today, count: 0 };
  }
  return stats;
}

function updateDailyStats() {
  const stats = getDailyStats();
  stats.count += 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  return stats.count;
}

export async function validateFile(file) {
  if (!file) {
    throw new Error('No file selected');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
  }

  if (file.type !== 'application/pdf') {
    throw new Error('Only PDF files are supported');
  }

  const stats = getDailyStats();
  if (stats.count >= MAX_DAILY_FILES) {
    throw new Error(`Daily limit of ${MAX_DAILY_FILES} files reached. Please try again tomorrow.`);
  }
}

export async function extractTextFromPDF(file) {
  try {
    await validateFile(file);
    const text = await pdfToText(file);
    updateDailyStats();
    return createTextFile(text);
  } catch (error) {
    console.error('PDF processing error:', error);
    throw new Error('Failed to process PDF: ' + error.message);
  }
}

function createTextFile(text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  return new File([blob], 'extracted-text.txt', { type: 'text/plain' });
}