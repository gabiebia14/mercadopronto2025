/*
  # Create Receipts Table

  1. New Table
    - `receipts`
      - `id` (uuid, primary key)
      - `product_name` (text) - Nome do Produto
      - `unit_price` (numeric) - Preço Unitário
      - `quantity` (numeric) - Quantidade
      - `purchase_date` (date) - Data da Compra
      - `total_value` (numeric) - Valor Total
      - `store` (text) - Mercado
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policy for authenticated users to manage their own data
*/

CREATE TABLE receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name text NOT NULL,
  unit_price numeric NOT NULL CHECK (unit_price > 0),
  quantity numeric NOT NULL CHECK (quantity > 0),
  purchase_date date NOT NULL,
  total_value numeric NOT NULL CHECK (total_value > 0),
  store text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage receipts"
  ON receipts
  FOR ALL
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_receipts_purchase_date ON receipts(purchase_date);
CREATE INDEX idx_receipts_store ON receipts(store);
CREATE INDEX idx_receipts_product_name ON receipts(product_name);