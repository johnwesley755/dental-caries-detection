-- SQL Fixes for Existing Databases
-- ---------------------------------
-- Run this script if you have an EXISTING 'dental_caries' database and are
-- getting 500 errors on /api/v1/appointments.
-- This adds missing columns added after initial table creation.

-- ============================================================
-- STEP 1: Fix appointment status column (VARCHAR instead of native enum)
-- ============================================================

-- 1a. Convert status column from native enum to plain VARCHAR
ALTER TABLE appointments
  ALTER COLUMN status TYPE VARCHAR(255);

-- 1b. Drop old check constraint if present
ALTER TABLE appointments
  DROP CONSTRAINT IF EXISTS chk_appointment_status;

-- 1c. Drop old PostgreSQL native enum type entirely
DROP TYPE IF EXISTS appointmentstatus CASCADE;

-- ============================================================
-- STEP 2: Add missing columns to the appointments table
-- ============================================================

-- 2a. Add detection_id column (nullable FK to detections)
ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS detection_id UUID REFERENCES detections(id) ON DELETE SET NULL;

-- 2b. Add updated_at column if missing
ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- ============================================================
-- STEP 3: Fix Dentist Verification (if missing)
-- ============================================================
-- migration for dentist verification lifecycle
-- we only add the missing status and audit fields
ALTER TABLE dentist_profiles
  ADD COLUMN IF NOT EXISTS verification_status VARCHAR(20) DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS rejection_reason     TEXT,
  ADD COLUMN IF NOT EXISTS verified_at          TIMESTAMP,
  ADD COLUMN IF NOT EXISTS verified_by_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS phone_number         VARCHAR(50),
  ADD COLUMN IF NOT EXISTS years_of_experience  VARCHAR(20),
  ADD COLUMN IF NOT EXISTS profile_image_url     TEXT;

-- ============================================================
-- STEP 4: Verify the final schema
-- ============================================================
-- Run this SELECT to confirm all columns exist:
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'appointments'
-- ORDER BY ordinal_position;
