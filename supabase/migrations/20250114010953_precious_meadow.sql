/*
  # Create Receipts Table

  1. New Table
    - `receipts`
      - `id` (uuid, primary key)
      - `nome_produto` (text) - Nome do Produto
      - `preco_unitario` (numeric) - Preço Unitário
      - `quantidade` (numeric) - Quantidade
      - `data_compra` (date) - Data da Compra
      - `mercado` (text) - Mercado
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policy for authenticated users to manage their own data
*/

CREATE TABLE receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_produto text NOT NULL,
  preco_unitario numeric NOT NULL CHECK (preco_unitario > 0),
  quantidade numeric NOT NULL CHECK (quantidade > 0),
  data_compra date NOT NULL,
  mercado text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage receipts"
  ON receipts
  FOR ALL
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_receipts_data_compra ON receipts(data_compra);
CREATE INDEX idx_receipts_mercado ON receipts(mercado);
CREATE INDEX idx_receipts_nome_produto ON receipts(nome_produto);