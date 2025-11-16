-- Fix users table INSERT policy to allow signup

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can insert own record" ON users;

-- Allow authenticated users to insert their own user record
CREATE POLICY "Users can insert own record" ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Also add UPDATE policy for users to update their own data
DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data" ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- HR/Admin can read all users
DROP POLICY IF EXISTS "HR can read all users" ON users;
CREATE POLICY "HR can read all users" ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  );

-- HR/Admin can update any user
DROP POLICY IF EXISTS "HR can update any user" ON users;
CREATE POLICY "HR can update any user" ON users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  );

