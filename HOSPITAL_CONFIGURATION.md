# Hospital Configuration for PDF Reports

Since this is a **hospital with multiple dentists**, the PDF reports are designed to show:

## What Appears on Reports

### Hospital Information (Footer)
- Hospital Name
- Hospital Address
- Hospital Phone
- Hospital Email

### Dentist Information
- The specific dentist who performed the detection
- Automatically pulled from the `dentist_id` in the detection record

### Patient Information
- Patient name
- Detection date
- Detection ID

## Configuration

Add to `backend/.env`:

```env
# Hospital Information
HOSPITAL_NAME=City Dental Hospital
HOSPITAL_ADDRESS=123 Medical Center Drive, City, State 12345
HOSPITAL_PHONE=+1-234-567-8900
HOSPITAL_EMAIL=info@citydentalhosp.com
HOSPITAL_LOGO_URL=https://your-cdn.com/hospital-logo.png
```

## How It Works

1. **Multiple Dentists**: Each dentist in the hospital can:
   - Perform detections
   - Download PDF reports
   - Email reports to patients
   
2. **Report Attribution**: Each report shows:
   - Which dentist performed the detection
   - Hospital branding (not individual dentist branding)
   - Consistent hospital contact information

3. **Centralized Branding**: All reports have:
   - Same hospital name and logo
   - Same contact information
   - Professional, unified appearance

## Example Report Footer

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

              City Dental Hospital
          123 Medical Center Drive
              City, State 12345
           Phone: +1-234-567-8900
        Email: info@citydentalhosp.com

     Report generated on December 30, 2025
              at 12:15 PM

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Benefits

✅ **Consistent Branding**: All reports show hospital information
✅ **Multi-Doctor Support**: Each dentist's work is tracked
✅ **Professional**: Unified hospital identity
✅ **Centralized Contact**: Patients contact hospital, not individual dentists
