-- Fix 1: Create the missing 'harvests' table
CREATE TABLE IF NOT EXISTS harvests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tank_id UUID REFERENCES tanks(id) ON DELETE CASCADE,
    harvest_qty NUMERIC NOT NULL,
    sale_price NUMERIC,
    buyer_name TEXT,
    harvest_type TEXT NOT NULL,
    harvest_date DATE NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fix 2: Add missing 'audio_path' column to 'posts' table for voice recordings
ALTER TABLE posts ADD COLUMN IF NOT EXISTS audio_path TEXT;

-- Fix 3: Add new columns to 'harvests' table that match the UI requirements
ALTER TABLE harvests 
  ADD COLUMN IF NOT EXISTS count_per_kg NUMERIC,
  ADD COLUMN IF NOT EXISTS price_per_kg NUMERIC,
  ADD COLUMN IF NOT EXISTS total_revenue NUMERIC,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Fix 4: Auth Redesign - Add PIN and Security Columns to Users
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS pin_hash TEXT,
  ADD COLUMN IF NOT EXISTS pin_set_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS failed_login_attempts INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMPTZ;

-- Fix 5: Auth Redesign - Add purpose and verified columns to otps
-- (Assuming otps table already exists, we alter it. If it doesn't exist, you'll need to create it)
ALTER TABLE otps
  ADD COLUMN IF NOT EXISTS purpose VARCHAR(30) DEFAULT 'REGISTER',
  ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE;

-- Force PostgREST schema cache reload so the new columns are immediately available to the API
NOTIFY pgrst, 'reload schema';
