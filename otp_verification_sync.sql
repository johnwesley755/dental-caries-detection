-- SQL Script: Synchronize User Model for OTP Verification
-- Run this in your NEON SQL Editor to enable the new 6-digit verification flow.

-- Add verification OTP column (6 digits)
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_otp VARCHAR(6);

-- Add OTP expiry column with timezone support
ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_expiry TIMESTAMP WITH TIME ZONE;

-- (Optional) If you haven't run the previous fix, here are the other required columns:
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;
