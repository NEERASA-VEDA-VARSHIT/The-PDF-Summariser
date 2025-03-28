import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error('Missing Gemini API key');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const generationConfig = {
  temperature: 0.1, // Reduced for more focused responses
  maxOutputTokens: 1024, // Reduced token limit
  topP: 0.7, // Reduced for more focused responses
};

function chunkText(text, maxLength = 4000) {
  // Use paragraphs as natural break points
  const paragraphs = text.split(/\n\s*\n/);
  const chunks = [];
  let currentChunk = '';
  
  for (const paragraph of paragraphs) {
    if ((currentChunk + paragraph).length > maxLength) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = paragraph;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  }
  
  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}

function extractJSONFromText(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    const jsonMatch = text.match(/\{[\s\S]*\}/) || text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e2) {
        console.warn('Failed to parse JSON from match');
      }
    }

    // Efficient regex patterns
    const summaryPattern = /summary["']?\s*:\s*["']([^"'}]+)["']?/i;
    const flashcardsPattern = /flashcards["']?\s*:\s*\[([\s\S]*?)\]/i;
    
    const summary = text.match(summaryPattern)?.[1]?.trim() || '';
    const flashcardsMatch = text.match(flashcardsPattern);
    
    const flashcards = [];
    if (flashcardsMatch) {
      const cardPattern = /\{[^}]*question["']?\s*:\s*["']([^"']+)["']?[^}]*answer["']?\s*:\s*["']([^"']+)["']?[^}]*\}/g;
      let match;
      while ((match = cardPattern.exec(flashcardsMatch[1])) !== null) {
        flashcards.push({
          question: match[1].trim(),
          answer: match[2].trim()
        });
      }
    }

    return { summary, flashcards };
  }
}

async function processSingleChunk(chunk, options) {
  const { flashcardTopic } = options;
  
  const prompt = `Analyze this text and provide a concise JSON response with a brief summary and key flashcards.
${flashcardTopic ? `Focus specifically on: ${flashcardTopic}\n` : ''}
Format:
{
  "summary": "Brief, focused summary",
  "flashcards": [
    {"question": "Clear, specific question", "answer": "Concise answer"}
  ]
}

Text: ${chunk}`;

  const result = await model.generateContent({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig,
  });

  return extractJSONFromText(result.response.text());
}

export async function processText(text, options) {
  const { flashcardCount = 5 } = options;

  try {
    const chunks = chunkText(text);
    const results = await Promise.all(
      chunks.map(chunk => processSingleChunk(chunk, options))
    );

    // Combine results efficiently
    const summary = results
      .map(r => r.summary)
      .filter(Boolean)
      .join(' ');

    const flashcards = results
      .flatMap(r => r.flashcards)
      .filter(card => 
        card.question && 
        card.answer && 
        card.question.length > 10 && 
        card.answer.length > 5
      )
      .slice(0, flashcardCount);

    return {
      summary: summary.trim(),
      flashcards
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to process text with Gemini API');
  }
}