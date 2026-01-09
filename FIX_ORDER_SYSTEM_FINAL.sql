-- ============================================================
-- FINAL FIX (v4): RESOLVING ADMIN DASHBOARD VISIBILITY
-- ============================================================

-- 1. Correctly drop all foreign key constraints on order_items.product_id
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN (
        SELECT constraint_name 
        FROM information_schema.key_column_usage 
        WHERE table_name = 'order_items' 
          AND column_name = 'product_id' 
          AND constraint_name LIKE '%fkey%'
    ) LOOP
        EXECUTE 'ALTER TABLE order_items DROP CONSTRAINT ' || quote_ident(r.constraint_name);
    END LOOP;
END $$;

-- 2. Ensure product_id is TEXT and product_name exists
ALTER TABLE order_items ALTER COLUMN product_id TYPE TEXT;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='order_items' AND column_name='product_name') THEN
        ALTER TABLE order_items ADD COLUMN product_name TEXT;
    END IF;
END $$;

-- 3. Fix RLS Recursion and Permissions on profiles
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated users read profiles" ON profiles;

CREATE POLICY "Authenticated users read profiles" ON profiles FOR SELECT USING (
  auth.role() = 'authenticated'
);

-- 4. Fix Order System RLS (Orders Table)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users create orders" ON orders;
CREATE POLICY "Users create orders" ON orders FOR INSERT WITH CHECK (
  auth.uid() = user_id OR user_id IS NULL
);

DROP POLICY IF EXISTS "Users see own orders" ON orders;
CREATE POLICY "Users see own orders" ON orders FOR SELECT USING (
  auth.uid() = user_id OR user_id IS NULL
);

DROP POLICY IF EXISTS "Admins see all orders" ON orders;
CREATE POLICY "Admins see all orders" ON orders FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- 5. Fix Order System RLS (Order Items Table)
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users create order items" ON order_items;
CREATE POLICY "Users create order items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
  )
);

DROP POLICY IF EXISTS "Admins see all order items" ON order_items;
CREATE POLICY "Admins see all order items" ON order_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- 6. Sync missing profiles from auth.users
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'user'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 7. (Optional) Fix user_cart RLS
ALTER TABLE user_cart ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own cart" ON user_cart;
CREATE POLICY "Users manage own cart" ON user_cart FOR ALL USING (
  auth.uid() = user_id
);
