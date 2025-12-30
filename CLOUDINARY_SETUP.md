# Environment Setup for Cloudinary Integration

## Backend Environment Variables

Add the following to your `backend/.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## Getting Cloudinary Credentials

1. **Sign up for Cloudinary** (if you haven't already):
   - Go to https://cloudinary.com/users/register_free
   - Create a free account

2. **Get your credentials**:
   - After logging in, go to your Dashboard
   - You'll see your credentials in the "Account Details" section:
     - **Cloud Name**: This is your unique identifier
     - **API Key**: Your public API key
     - **API Secret**: Your secret key (keep this private!)

3. **Copy the credentials** to your `backend/.env` file

## Database Migration

Run the SQL migration to add Cloudinary URL fields to your database:

```sql
-- Add Cloudinary URL columns to detections table
ALTER TABLE detections 
ADD COLUMN original_image_url VARCHAR,
ADD COLUMN annotated_image_url VARCHAR,
ADD COLUMN original_image_public_id VARCHAR,
ADD COLUMN annotated_image_public_id VARCHAR;
```

Or use the migration file created at:
`backend/add_cloudinary_urls.sql`

## Testing the Integration

1. **Start the backend**:
   ```bash
   cd backend
   ./venv/Scripts/activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   python -m uvicorn app.main:app --reload
   ```

2. **Start the frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test image upload**:
   - Navigate to `/detection`
   - Upload a dental image
   - Check that:
     - Image uploads successfully
     - Cloudinary dashboard shows the uploaded image
     - Detection completes successfully

4. **Test detection details view**:
   - Navigate to `/dashboard`
   - Click "View Details" on any detection card
   - Verify:
     - Original and annotated images display from Cloudinary
     - Image comparison (split/slider) works
     - Charts and statistics display correctly

## Troubleshooting

### Images not uploading to Cloudinary
- Check that your Cloudinary credentials are correct in `.env`
- Verify the backend server restarted after adding credentials
- Check backend console for error messages

### Images not displaying in frontend
- Open browser DevTools Network tab
- Check if image URLs are being returned from API
- Verify Cloudinary URLs are accessible (try opening in new tab)
- Check for CORS issues in browser console

### Migration errors
- Ensure you're connected to the correct database
- Check if columns already exist (may have been added previously)
- Verify you have permission to alter the table
