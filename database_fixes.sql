-- SQL Fixes for Existing Databases
-- ---------------------------------
-- If you are setting up the project on a NEW laptop, you do NOT need to run this script.
-- The recent Python fixes ensure the database will be created correctly from scratch. 
--
-- HOWEVER, if the other laptop already has an existing 'dental_caries' database running
-- and experiences the "CheckViolation" or Enum errors, run the following SQL statements 
-- to forcefully clean up the old restrictive database schema properties.

-- 1. Remove the restrictive native enum constraint on the appointment status
ALTER TABLE appointments 
  ALTER COLUMN status TYPE VARCHAR(255);

-- 2. Drop the old enum constraint if it exists (SQLAlchemy Check Constraint name)
ALTER TABLE appointments 
  DROP CONSTRAINT IF EXISTS chk_appointment_status;

-- 3. Drop the old PostgreSQL native enum type entirely since the app now uses simple Strings
DROP TYPE IF EXISTS appointmentstatus CASCADE;
