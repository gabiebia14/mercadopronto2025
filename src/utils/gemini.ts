import { GoogleGenerativeAI } from "@google/generative-ai";
import { ExpenseData } from '../types';
import { GEMINI_API_KEY, RECEIPT_PROMPT } from './config';
import { convertImageToBase64 } from './imageProcessing';
import { parseReceiptData } from './receiptParser';

export const processImageWithGemini = async (imageFile: File): Promise<ExpenseData[]> => {
  if (!GEMINI_API_KEY) {
    throw new Error('API Gemini não configurada. Configure a variável VITE_GEMINI_API_KEY no arquivo .env');
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.1,
        topP: 0.1,
        topK: 16,
        maxOutputTokens: 2048,
      }
    });

    const base64Image = await convertImageToBase64(imageFile);
    
    const imagePart = {
      inlineData: {
        data: base64Image.split(',')[1],
        mimeType: imageFile.type
      }
    };

    const result = await model.generateContent([RECEIPT_PROMPT, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('Não foi possível extrair texto da imagem');
    }

    const parsedData = parseReceiptData(text);
    
    if (parsedData.length === 0) {
      throw new Error('Nenhum item foi encontrado no recibo');
    }

    return parsedData;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('NOT_FOUND')) {
        throw new Error('Serviço temporariamente indisponível. Tente novamente mais tarde.');
      }
      throw error;
    }
    throw new Error('Erro inesperado ao processar o recibo');
  }
};