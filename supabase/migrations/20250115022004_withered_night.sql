/*
  # Add authentication and user data isolation

  1. Security Updates
    - Update RLS policies to enforce user-based access control
    - Add policies for authenticated and anonymous users
    - Ensure each user can only access their own data

  2. Changes
    - Add user_id foreign key reference to auth.users
    - Update existing policies for better security
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
DROP POLICY IF EXISTS "Users can manage their own receipts" ON receipts;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON receipts;
DROP POLICY IF EXISTS "Allow anonymous reads" ON receipts;

-- Create new policies
CREATE POLICY "Users can manage their own receipts"
  ON receipts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

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