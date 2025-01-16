export const convertImageToBase64 = async (file: File): Promise<string> => {
  try {
    return new Promise((resolve, reject) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        reject(new Error('O arquivo deve ser uma imagem'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('Falha ao converter imagem'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Erro ao ler arquivo de imagem'));
      };
      
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Erro ao processar imagem:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Erro ao processar imagem');
  }
};