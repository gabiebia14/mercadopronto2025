/*
  # Initial Schema Setup

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Maps to Supabase auth.users
      - `email` (text, unique)
      - `created_at` (timestamp)
    
    - `stores`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)
    
    - `expenses`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `store_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `unit_price` (numeric)
      - `quantity` (numeric)
      - `purchase_date` (date)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Stores table
CREATE TABLE stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(name, user_id)
);

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own stores"
  ON stores
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(name, user_id)
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own products"
  ON products
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Expenses table
CREATE TABLE expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  unit_price numeric NOT NULL CHECK (unit_price > 0),
  quantity numeric NOT NULL CHECK (quantity > 0),
  purchase_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own expenses"
  ON expenses
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_purchase_date ON expenses(purchase_date);
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_stores_user_id ON stores(user_id);