export const convertImageToBase64 = async (file: File): Promise<string> => {
  if (!file.type.startsWith('image/')) {
    throw new Error('O arquivo deve ser uma imagem');
  }

  return new Promise((resolve, reject) => {
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
};