# 📅 Calendar & Notifications System - User Guide

## Overview

The Calendar and Notifications system allows dentists to schedule appointments and automatically notifies patients. Here's how it works for each user role.

---

## 🎯 How It Works

### 1. Creating an Appointment

**Who can create:** Dentists and Admins

**Process:**
1. Dentist clicks the **Calendar icon** in the sidebar
2. Calendar modal opens showing all appointments
3. Dentist clicks **"New Appointment"** button
4. Fills in the form:
   - **Patient** - Select from dropdown
   - **Date & Time** - Pick appointment date/time
   - **Duration** - Default 30 minutes
   - **Type** - checkup, cleaning, treatment, etc.
   - **Notes** - Optional notes
5. Clicks **"Create Appointment"**

**What happens behind the scenes:**
```
1. Appointment is saved to database with status "scheduled"
2. System automatically creates a notification for the patient
3. Notification appears in patient's bell icon (if they have portal access)
4. Appointment appears in dentist's calendar
```

---

## 👥 User Roles & Permissions

### 🦷 Dentist Role

**Can do:**
- ✅ View ALL appointments in the system
- ✅ Create appointments for any patient
- ✅ Update appointment status (scheduled → confirmed → completed)
- ✅ Cancel appointments
- ✅ View their own notifications
- ✅ See appointment calendar with all scheduled visits

**Calendar View:**
- Shows all appointments across all patients
- Color-coded by status:
  - 🟦 Scheduled (blue)
  - 🟩 Confirmed (green)
  - 🟨 Completed (yellow)
  - 🟥 Cancelled (red)

**Notifications:**
- System notifications
- Appointment reminders
- Detection reports ready

---

### 👤 Patient Role

**Can do:**
- ✅ View ONLY their own appointments
- ✅ See appointment details
- ✅ Receive notifications about their appointments
- ❌ Cannot create appointments (only dentist can)
- ❌ Cannot see other patients' appointments

**Calendar View:**
- Shows only appointments where they are the patient
- Same color coding as dentist view

**Notifications:**
- Appointment scheduled/confirmed/cancelled
- Detection results available
- Report ready for review

---

### 👨‍💼 Admin Role

**Can do:**
- ✅ View ALL appointments (same as dentist)
- ✅ Create appointments
- ✅ Manage all appointments
- ✅ View system-wide notifications
- ✅ Full access to calendar

---

## 🔔 Notification System

### How Notifications Are Created

**Automatic notifications are sent when:**

1. **Appointment Scheduled**
   ```
   Title: "Appointment scheduled"
   Message: "Your appointment has been scheduled for January 15, 2026 at 10:00 AM"
   Type: appointment
   Recipient: Patient
   ```

2. **Appointment Confirmed**
   ```
   Title: "Appointment confirmed"
   Message: "Your appointment has been confirmed for January 15, 2026 at 10:00 AM"
   Type: appointment
   Recipient: Patient
   ```

3. **Appointment Cancelled**
   ```
   Title: "Appointment cancelled"
   Message: "Your appointment has been cancelled for January 15, 2026 at 10:00 AM"
   Type: appointment
   Recipient: Patient
   ```

4. **Detection Complete** (existing feature)
   ```
   Title: "New Detection Available"
   Message: "A new dental caries detection has been completed"
   Type: detection
   Recipient: Patient
   ```

### Notification Features

**Bell Icon Badge:**
- Shows count of unread notifications
- Updates in real-time
- Red badge for unread items

**Notification Dropdown:**
- Click bell icon to open
- Shows last 20 notifications
- Newest first
- Click notification to mark as read
- "Mark all as read" button

**Notification Types:**
- 🔍 **Detection** - AI analysis complete
- 📅 **Appointment** - Appointment updates
- 📄 **Report** - Reports ready
- ⚙️ **System** - System messages
- ⏰ **Reminder** - Appointment reminders

---

## 📊 API Endpoints

### Appointments

```
GET    /api/v1/appointments              - List all appointments
POST   /api/v1/appointments              - Create new appointment
GET    /api/v1/appointments/{id}         - Get appointment details
PUT    /api/v1/appointments/{id}         - Update appointment
DELETE /api/v1/appointments/{id}         - Cancel appointment
```

**Query Parameters:**
- `status` - Filter by status (scheduled, confirmed, completed, cancelled)
- `patient_id` - Filter by patient

**Role-based filtering:**
- Dentist/Admin: See all appointments
- Patient: Automatically filtered to their own appointments

### Notifications

```
GET    /api/v1/notifications              - List notifications
GET    /api/v1/notifications/unread-count - Get unread count
PUT    /api/v1/notifications/{id}/read    - Mark as read
PUT    /api/v1/notifications/mark-all-read - Mark all as read
DELETE /api/v1/notifications/{id}         - Delete notification
```

**Query Parameters:**
- `unread_only=true` - Show only unread notifications
- `limit=50` - Number of notifications to return

---

## 🎨 Frontend Components

### Calendar Modal (`CalendarModal.tsx`)
- Full calendar view using `react-big-calendar`
- Month/Week/Day views
- Click date to create appointment
- Click event to view details
- Appointment form integrated

### Notification Dropdown (`NotificationDropdown.tsx`)
- Bell icon in sidebar
- Badge with unread count
- Dropdown with notification list
- Real-time updates
- Mark as read functionality

### Appointment Form (`AppointmentForm.tsx`)
- Patient selection dropdown
- Date/time picker
- Duration input
- Type selection
- Notes textarea
- Validation

---

## 🔐 Security & Privacy

**Data Protection:**
- All API calls require authentication (Bearer token)
- Patients can ONLY see their own data
- Dentists/Admins can see all data
- Role-based access control enforced at API level

**Database Security:**
- Foreign key constraints ensure data integrity
- UUID primary keys prevent enumeration attacks
- Timestamps track all changes
- Soft delete for appointments (status = cancelled)

---

## 📱 User Flows

### Flow 1: Dentist Schedules Appointment

```
1. Dentist logs in → Dashboard
2. Clicks Calendar icon → Calendar modal opens
3. Clicks "New Appointment" → Form appears
4. Selects patient "John Doe"
5. Picks date "Jan 15, 2026, 10:00 AM"
6. Selects type "Checkup"
7. Adds note "Regular 6-month checkup"
8. Clicks "Create"
   ↓
9. Appointment saved to database
10. Notification created for John Doe
11. Calendar updates with new appointment
12. Success message shown
```

### Flow 2: Patient Receives Notification

```
1. Patient logs in → Dashboard
2. Sees red badge on bell icon (1 unread)
3. Clicks bell icon → Dropdown opens
4. Sees: "Appointment scheduled for Jan 15, 2026 at 10:00 AM"
5. Clicks notification → Marked as read
6. Badge updates to 0
7. Clicks Calendar icon → Sees appointment in calendar
```

### Flow 3: Dentist Updates Appointment

```
1. Dentist opens calendar
2. Clicks on appointment
3. Changes status to "Confirmed"
4. Clicks "Update"
   ↓
5. Appointment status updated
6. New notification sent to patient
7. Patient sees "Appointment confirmed" notification
```

---

## 🧪 Testing Guide

### Test as Dentist:
1. Create appointment for a patient
2. Verify it appears in calendar
3. Check patient received notification
4. Update appointment status
5. Cancel appointment

### Test as Patient:
1. Log in to patient portal
2. Check bell icon for notifications
3. Open calendar
4. Verify only YOUR appointments show
5. Try to access another patient's data (should fail)

### Test as Admin:
1. View all appointments
2. Create appointments
3. Manage system notifications
4. View analytics

---

## 🐛 Troubleshooting

**Appointments not showing:**
- Check user role (patients only see their own)
- Verify appointment was created successfully
- Check date range in calendar view

**Notifications not appearing:**
- Check patient has `user_id` set (portal access)
- Verify notification was created in database
- Check bell icon badge count
- Try refreshing the page

**Cannot create appointment:**
- Verify you're logged in as dentist/admin
- Check patient exists in system
- Ensure all required fields are filled
- Check browser console for errors

---

## 📈 Future Enhancements

**Planned features:**
- 📧 Email notifications
- 📱 SMS reminders
- 🔄 Recurring appointments
- ⏰ Automatic reminders (24h before)
- 📊 Appointment analytics
- 🗓️ Patient self-booking (optional)
- 🔔 Push notifications
- 📅 iCal export

---

## 💡 Best Practices

**For Dentists:**
- Always add notes to appointments
- Confirm appointments 24h before
- Update status promptly
- Cancel with notice

**For Patients:**
- Check notifications regularly
- Review appointment details
- Contact office if issues
- Keep portal info updated

**For Admins:**
- Monitor notification delivery
- Review appointment patterns
- Maintain patient data quality
- Regular system checks
