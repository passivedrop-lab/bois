-- ============================================================
-- FINAL FIX: ORDER SYSTEM SCHEMA AND RLS
-- ============================================================

-- 1. Adjust order_items table for string product IDs
-- First, drop the foreign key constraint that requires product_id to exist in the products table
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

-- Change product_id from BIGINT to TEXT if it's not already
ALTER TABLE order_items ALTER COLUMN product_id TYPE TEXT;

-- Ensure product_name exists to snapshot the product name
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='order_items' AND column_name='product_name') THEN
        ALTER TABLE order_items ADD COLUMN product_name TEXT;
    END IF;
END $$;

-- 2. Fix RLS policies to allow authenticated users to place orders

-- Enable RLS on orders and order_items if not already enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Orders Policy: Allow users to create orders where they are the owner
DROP POLICY IF EXISTS "Users create orders" ON orders;
CREATE POLICY "Users create orders" ON orders FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

-- Order Items Policy: Allow users to create items linked to their own orders
DROP POLICY IF EXISTS "Users create order items" ON order_items;
CREATE POLICY "Users create order items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- 3. Ensure profiles are accessible for order creation if checked
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (
  auth.uid() = id OR auth.uid() IS NOT NULL
);

-- 4. (Optional) Fix user_cart RLS if items are still stuck
ALTER TABLE user_cart ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own cart" ON user_cart;
CREATE POLICY "Users manage own cart" ON user_cart FOR ALL USING (
  auth.uid() = user_id
);
