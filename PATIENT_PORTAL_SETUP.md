# Patient Portal - Appointments & Notifications Setup

## 📋 Current Status

### ✅ What's Already Working
- **Backend API**: Fully functional for both frontend and patient portal
  - `/api/v1/appointments` - Returns only patient's own appointments
  - `/api/v1/notifications` - Returns only patient's own notifications
  - Role-based filtering is automatic

### ❌ What's Missing in Patient Portal
The patient portal **does NOT have** these components yet:
- Calendar Modal (to view appointments)
- Notification Dropdown (to see notifications)
- Appointment services
- Notification services

---

## 🎯 How It Will Work

### For Patients (When Implemented)

**Scenario:**
1. Dentist creates appointment for patient "John Doe"
2. Backend automatically creates notification for John
3. **Patient Portal** (when John logs in):
   - Bell icon shows red badge with "1" unread notification
   - Click bell → See "Appointment scheduled for Jan 15, 10:00 AM"
   - Click Calendar icon → See appointment in calendar
   - Can view appointment details
   - **Cannot create** new appointments (only dentist can)

---

## 🚀 Option 1: Copy Components from Frontend (Recommended)

### Files to Copy

Copy these files from `frontend` to `patient-portal`:

```
frontend/src/services/appointmentService.ts
  → patient-portal/src/services/appointmentService.ts

frontend/src/services/notificationService.ts
  → patient-portal/src/services/notificationService.ts

frontend/src/components/dashboard/CalendarModal.tsx
  → patient-portal/src/components/dashboard/CalendarModal.tsx

frontend/src/components/dashboard/NotificationDropdown.tsx
  → patient-portal/src/components/dashboard/NotificationDropdown.tsx

frontend/src/components/dashboard/AppointmentForm.tsx
  → patient-portal/src/components/dashboard/AppointmentForm.tsx
```

### Install Dependencies

```bash
cd patient-portal
npm install react-big-calendar date-fns
npm install --save-dev @types/react-big-calendar
```

### Modify for Patient Portal

**1. Remove "Create Appointment" Button from CalendarModal.tsx**

Patients should only VIEW appointments, not create them:

```tsx
// In CalendarModal.tsx, remove or hide the "New Appointment" button
// Line ~50-60, comment out or add condition:
{/* Patients can't create appointments */}
{/* <Button onClick={() => setShowForm(true)}>New Appointment</Button> */}
```

**2. Update Sidebar to Include Icons**

In `patient-portal/src/components/common/Sidebar.tsx`, add:

```tsx
import { Calendar, Bell } from 'lucide-react';
import { CalendarModal } from '../dashboard/CalendarModal';
import { NotificationDropdown } from '../dashboard/NotificationDropdown';

// Add state
const [showCalendar, setShowCalendar] = useState(false);

// Add icons in navigation
<button onClick={() => setShowCalendar(true)}>
  <Calendar className="h-5 w-5" />
</button>

<NotificationDropdown />

// Add modal
{showCalendar && (
  <CalendarModal 
    isOpen={showCalendar} 
    onClose={() => setShowCalendar(false)} 
  />
)}
```

---

## 🎨 Option 2: Simplified Patient View (Alternative)

Instead of full calendar, create a simpler "My Appointments" page:

### Create `patient-portal/src/pages/MyAppointments.tsx`

```tsx
import React, { useEffect, useState } from 'react';
import { appointmentService } from '../services/appointmentService';
import { Calendar, Clock, User } from 'lucide-react';

export const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
      
      <div className="space-y-4">
        {appointments.map((appt) => (
          <div key={appt.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">{appt.appointment_type}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(appt.appointment_date).toLocaleDateString()} at{' '}
                  {new Date(appt.appointment_date).toLocaleTimeString()}
                </p>
                <p className="text-sm text-gray-500">
                  with Dr. {appt.dentist_name}
                </p>
                <span className={`inline-block px-2 py-1 text-xs rounded ${
                  appt.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  appt.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {appt.status}
                </span>
              </div>
            </div>
            {appt.notes && (
              <p className="mt-4 text-sm text-gray-600">
                Notes: {appt.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Add to Routes

In `patient-portal/src/App.tsx`:

```tsx
import { MyAppointments } from './pages/MyAppointments';

// Add route
<Route path="/appointments" element={<MyAppointments />} />
```

---

## 🔔 Notifications in Patient Portal

### Add Notification Dropdown to Sidebar

**File:** `patient-portal/src/components/common/Sidebar.tsx`

```tsx
import { NotificationDropdown } from '../dashboard/NotificationDropdown';

// In the sidebar navigation:
<NotificationDropdown />
```

This will show:
- Bell icon with red badge
- Unread count
- Dropdown with notifications
- Mark as read functionality

---

## 📊 Comparison

| Feature | Frontend (Dentist) | Patient Portal |
|---------|-------------------|----------------|
| View Appointments | All patients | Own only |
| Create Appointments | ✅ Yes | ❌ No |
| View Calendar | ✅ Full calendar | ✅ Own appointments |
| Receive Notifications | ✅ Yes | ✅ Yes |
| Notification Badge | ✅ Yes | ✅ Yes |
| Mark as Read | ✅ Yes | ✅ Yes |

---

## 🛠️ Quick Setup Script

### PowerShell Script to Copy Components

```powershell
# Navigate to project root
cd "C:\Users\johnw\OneDrive\Desktop\GIT\dental-caries"

# Create directories
New-Item -ItemType Directory -Force -Path "patient-portal\src\services"
New-Item -ItemType Directory -Force -Path "patient-portal\src\components\dashboard"

# Copy services
Copy-Item "frontend\src\services\appointmentService.ts" -Destination "patient-portal\src\services\appointmentService.ts"
Copy-Item "frontend\src\services\notificationService.ts" -Destination "patient-portal\src\services\notificationService.ts"

# Copy components
Copy-Item "frontend\src\components\dashboard\CalendarModal.tsx" -Destination "patient-portal\src\components\dashboard\CalendarModal.tsx"
Copy-Item "frontend\src\components\dashboard\NotificationDropdown.tsx" -Destination "patient-portal\src\components\dashboard\NotificationDropdown.tsx"
Copy-Item "frontend\src\components\dashboard\AppointmentForm.tsx" -Destination "patient-portal\src\components\dashboard\AppointmentForm.tsx"

Write-Host "✅ Components copied! Now install dependencies:" -ForegroundColor Green
Write-Host "cd patient-portal" -ForegroundColor Yellow
Write-Host "npm install react-big-calendar date-fns @types/react-big-calendar" -ForegroundColor Yellow
```

---

## ✅ Testing After Setup

### Test as Patient:

1. **Login to patient portal** (use patient credentials)
2. **Check bell icon** - Should show notifications
3. **Click bell** - See appointment notifications
4. **Click calendar icon** - See your appointments
5. **Verify** - Can't create appointments (button hidden)
6. **Verify** - Can't see other patients' appointments

### Test Flow:

```
Dentist (Frontend):
1. Create appointment for Patient A
   ↓
Backend:
2. Save appointment
3. Create notification for Patient A
   ↓
Patient A (Patient Portal):
4. Login → See bell badge "1"
5. Click bell → "Appointment scheduled..."
6. Click calendar → See appointment
```

---

## 🎯 Recommendation

**For now:** Use **Option 1** (copy components) because:
- ✅ Faster implementation
- ✅ Consistent UI with frontend
- ✅ Full calendar functionality
- ✅ All features work immediately

**Later:** Can create simplified views if needed

---

## 📝 Summary

**Current State:**
- ✅ Backend fully supports patient portal
- ✅ API endpoints filter by user automatically
- ❌ Patient portal UI components not added yet

**To Enable:**
1. Copy 5 files from frontend to patient-portal
2. Install 2 npm packages
3. Add icons to sidebar
4. Hide "Create Appointment" button for patients

**Result:**
- Patients can view their appointments
- Patients receive notifications
- Patients cannot create appointments
- Patients cannot see other patients' data

**Time to implement:** ~15 minutes
