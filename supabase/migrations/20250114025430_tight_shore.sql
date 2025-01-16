/*
  # Update receipts table and policies
  
  1. Changes
    - Add user_id column to receipts table
    - Update RLS policies for better security
  
  2. Security
    - Enable RLS
    - Add policies for authenticated and anonymous users
    - Link receipts to users when authenticated
*/

-- Add user_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'receipts' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE receipts ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage receipts" ON receipts;

-- Create new policies
CREATE POLICY "Users can manage their own receipts"
  ON receipts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Allow anonymous inserts"
  ON receipts
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous reads"
  ON receipts
  FOR SELECT
  TO anon
  USING (true);

-- Create index for user_id if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'receipts' AND indexname = 'idx_receipts_user_id'
  ) THEN
    CREATE INDEX idx_receipts_user_id ON receipts(user_id);
  END IF;
END $$;