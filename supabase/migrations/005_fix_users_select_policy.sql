-- Fix users table SELECT policy to allow users to read their own data

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can read own data" ON users;

-- Allow authenticated users to read their own user record
CREATE POLICY "Users can read own data" ON users FOR SELECT
  USING (auth.uid() = id);

-- The "HR can read all users" policy should already exist from migration 003
-- This new policy allows regular users to read their own data

