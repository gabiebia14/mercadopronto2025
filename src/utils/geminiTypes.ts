// Gemini API types
export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface GeminiError {
  error: {
    code: number;
    message: string;
    status: string;
  };
}