-- SQL Migration: Add Appointments and Notifications Tables
-- File: migrations/add_appointments_notifications.sql
-- Date: 2026-01-01

-- =====================================================
-- 1. CREATE APPOINTMENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    dentist_id UUID NOT NULL,
    
    appointment_date TIMESTAMP NOT NULL,
    duration_minutes VARCHAR(10) DEFAULT '30',
    
    status VARCHAR(20) DEFAULT 'scheduled',
    appointment_type VARCHAR(50) DEFAULT 'checkup',
    
    notes TEXT,
    reminder_sent VARCHAR(10) DEFAULT 'false',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_appointment_patient FOREIGN KEY (patient_id) 
        REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT fk_appointment_dentist FOREIGN KEY (dentist_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    
    -- Constraints
    CONSTRAINT chk_appointment_status CHECK (
        status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')
    )
);

-- Indexes for performance
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_dentist ON appointments(dentist_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- =====================================================
-- 2. CREATE NOTIFICATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'system',
    
    is_read BOOLEAN DEFAULT FALSE,
    
    related_id UUID,
    related_type VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_notification_type CHECK (
        type IN ('detection', 'appointment', 'report', 'system', 'reminder')
    )
);

-- Indexes for performance
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);

-- =====================================================
-- 3. UPDATE PATIENTS TABLE (Add appointments relationship)
-- =====================================================

-- No schema change needed - relationship handled by SQLAlchemy ORM

-- =====================================================
-- 4. SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Sample appointment
-- INSERT INTO appointments (id, patient_id, dentist_id, appointment_date, appointment_type, notes)
-- VALUES (
--     'sample-appt-001',
--     'patient-id-here',
--     'dentist-id-here',
--     '2026-01-15 10:00:00',
--     'checkup',
--     'Regular dental checkup'
-- );

-- Sample notification
-- INSERT INTO notifications (id, user_id, title, message, type)
-- VALUES (
--     'sample-notif-001',
--     'user-id-here',
--     'New Detection Available',
--     'A new dental caries detection has been completed for patient John Doe.',
--     'detection'
-- );

-- =====================================================
-- 5. ROLLBACK SCRIPT (if needed)
-- =====================================================

-- To rollback this migration:
-- DROP TABLE IF EXISTS appointments CASCADE;
-- DROP TABLE IF EXISTS notifications CASCADE;

-- =====================================================
-- NOTES:
-- =====================================================
-- 1. Run this script on your PostgreSQL database
-- 2. Make sure to backup your database before running
-- 3. Update patient_id and dentist_id in sample data
-- 4. Adjust timestamp format based on your database (PostgreSQL uses TIMESTAMP)
-- 5. For MySQL, use DATETIME instead of TIMESTAMP
