import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY, GENERATION_CONFIG } from './config';

export const createGeminiClient = () => {
  if (!GEMINI_API_KEY) {
    throw new Error('API Gemini não configurada. Configure a variável VITE_GEMINI_API_KEY no arquivo .env');
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  return genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: GENERATION_CONFIG
  });
};