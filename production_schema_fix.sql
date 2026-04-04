-- PRODUCTION DATABASE SCHEMA FIX (UPDATED)
-- ============================================================
-- Run this in your NEON CONSOLE (SQL Editor) to fix 500 errors
-- This adds missing columns to 'users', 'patients', and 'dentist_profiles'
-- ============================================================

-- 1. FIX USERS TABLE
-- ------------------------------------------------------------
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;

-- 2. FIX PATIENTS TABLE
-- ------------------------------------------------------------
ALTER TABLE patients
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;

-- 3. FIX DENTIST_PROFILES TABLE (CRITICAL)
-- ------------------------------------------------------------
-- This is where the ResponseValidationError was caught in the logs
ALTER TABLE dentist_profiles
  ADD COLUMN IF NOT EXISTS verification_status VARCHAR(20) DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS rejection_reason     TEXT,
  ADD COLUMN IF NOT EXISTS verified_at      TIMESTAMP,
  ADD COLUMN IF NOT EXISTS verified_by_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS phone_number     VARCHAR(50),
  ADD COLUMN IF NOT EXISTS years_of_experience VARCHAR(20),
  ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
  ADD COLUMN IF NOT EXISTS created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at       TIMESTAMP WITH TIME ZONE;

-- 4. ENSURE GENDER COMPATIBILITY
-- ------------------------------------------------------------
ALTER TABLE patients 
  ALTER COLUMN gender TYPE VARCHAR(50);

-- ============================================================
-- VERIFICATION (Optional)
-- ============================================================
-- SELECT table_name, column_name, data_type FROM information_schema.columns 
-- WHERE table_name IN ('users', 'patients', 'dentist_profiles')
-- ORDER BY table_name, ordinal_position;
