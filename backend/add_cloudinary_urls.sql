-- Add Cloudinary URL fields to detections table
-- Run this in Neon DB SQL Editor
-- Date: 2025-12-30

-- Add new columns for Cloudinary URLs
ALTER TABLE detections 
ADD COLUMN IF NOT EXISTS original_image_url VARCHAR,
ADD COLUMN IF NOT EXISTS annotated_image_url VARCHAR,
ADD COLUMN IF NOT EXISTS original_image_public_id VARCHAR,
ADD COLUMN IF NOT EXISTS annotated_image_public_id VARCHAR;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'detections'
AND column_name IN ('original_image_url', 'annotated_image_url', 'original_image_public_id', 'annotated_image_public_id')
ORDER BY column_name;
