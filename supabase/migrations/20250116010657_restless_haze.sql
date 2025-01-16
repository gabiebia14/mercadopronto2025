/*
  # Update receipts table schema

  1. Changes
    - Drop existing receipts table
    - Create new receipts table with updated schema to store complete receipts
    - Add RLS policies for the new table
    
  2. New Schema
    - id: UUID primary key
    - data_compra: Date of purchase
    - mercado: Store name
    - items: JSON array of items
    - total: Total amount
    - created_at: Timestamp
    - user_id: Reference to auth.users
*/

-- Drop existing table and its policies
DROP TABLE IF EXISTS receipts;

-- Create new table with updated schema
CREATE TABLE receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data_compra date NOT NULL,
  mercado text NOT NULL,
  items jsonb NOT NULL,
  total numeric NOT NULL CHECK (total >= 0),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users can manage their own receipts"
  ON receipts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_receipts_data_compra ON receipts(data_compra);
CREATE INDEX idx_receipts_mercado ON receipts(mercado);
CREATE INDEX idx_receipts_user_id ON receipts(user_id);