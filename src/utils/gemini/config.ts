import { GenerationConfig } from '@google/generative-ai';

export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const GENERATION_CONFIG: GenerationConfig = {
  temperature: 0.1,
  topP: 0.1,
  topK: 16,
  maxOutputTokens: 2048,
};

export const SYSTEM_PROMPT = `Você é um assistente especializado em extrair informações de recibos de supermercado.
Analise a imagem do recibo e retorne os dados EXATAMENTE neste formato, mantendo os números e prefixos:

1-Nome do Produto | 2-Preço Unitário | 3-Quantidade | 4-Data da Compra | 5-Mercado

REGRAS IMPORTANTES:
- MANTENHA EXATAMENTE os números e prefixos das colunas (1-, 2-, etc)
- Use | como separador entre colunas
- Preços em formato numérico (ex: 22.90)
- Quantidades em formato numérico (ex: 1 ou 0.5)
- Data no formato DD/MM/YYYY
- Não adicione cabeçalhos ou informações extras
- Uma linha por produto
- Não inclua linhas vazias
- Não calcule totais
- Não faça formatações adicionais

Exemplo de saída:
1-ARROZ BRANCO | 2-22.90 | 3-1 | 4-15/03/2024 | 5-SUPERMERCADO ABC
1-FEIJAO CARIOCA | 2-8.50 | 3-2 | 4-15/03/2024 | 5-SUPERMERCADO ABC
1-LEITE INTEGRAL | 2-5.99 | 3-6 | 4-15/03/2024 | 5-SUPERMERCADO ABC`;