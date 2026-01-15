-- ============================================================
-- FIX USER_CART SCHEMA
-- Desciption: Allow string IDs for custom orders and store variant details
-- ============================================================

-- 1. Drop existing table to recreate it cleanly (easiest way to change ID type)
DROP TABLE IF EXISTS user_cart;

-- 2. Recreate table with flexible schema
CREATE TABLE user_cart (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL, -- Changed from BIGINT to TEXT to support 'bc-1', 'custom-xyz'
    product_name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    image TEXT, -- New: Store product image URL
    variant_label TEXT, -- New: Store variant details (e.g. "Size: 200x200")
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    
    -- Unique constraint to prevent duplicate entries for same product+variant
    UNIQUE(user_id, product_id)
);

-- 3. Enable RLS
ALTER TABLE user_cart ENABLE ROW LEVEL SECURITY;

-- 4. Re-apply RLS Policies
CREATE POLICY "Users can manage their own cart"
  ON user_cart FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. Grant permissions
GRANT ALL ON user_cart TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE user_cart_id_seq TO authenticated;
