-- Create database
CREATE DATABASE dental_caries_db;

-- Connect to database
\c dental_caries_db;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('dentist', 'admin', 'assistant');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE image_type AS ENUM ('intraoral', 'bitewing', 'periapical', 'panoramic');
CREATE TYPE detection_status AS ENUM ('pending', 'completed', 'reviewed');
CREATE TYPE caries_type AS ENUM ('enamel', 'dentin', 'pulp');
CREATE TYPE severity_type AS ENUM ('mild', 'moderate', 'severe');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'dentist' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create patients table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    age INTEGER,
    gender gender_type,
    contact_number VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    medical_history JSONB,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create detections table
CREATE TABLE detections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    detection_id VARCHAR(50) UNIQUE NOT NULL,
    patient_id UUID REFERENCES patients(id) NOT NULL,
    dentist_id UUID REFERENCES users(id) NOT NULL,
    original_image_path VARCHAR(500) NOT NULL,
    annotated_image_path VARCHAR(500),
    image_type image_type,
    detection_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_teeth_detected INTEGER DEFAULT 0,
    total_caries_detected INTEGER DEFAULT 0,
    processing_time_ms FLOAT,
    confidence_threshold FLOAT,
    status detection_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create caries_findings table
CREATE TABLE caries_findings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    detection_id UUID REFERENCES detections(id) NOT NULL,
    tooth_number INTEGER,
    caries_type caries_type,
    severity severity_type,
    confidence_score FLOAT,
    bounding_box JSONB,
    segmentation_mask JSONB,
    area_mm2 FLOAT,
    location VARCHAR(100),
    treatment_recommendation TEXT
);

-- Create detection_history table
CREATE TABLE detection_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) NOT NULL,
    detection_id UUID REFERENCES detections(id) NOT NULL,
    action VARCHAR(50) NOT NULL,
    performed_by UUID REFERENCES users(id) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    changes JSONB
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_patients_patient_id ON patients(patient_id);
CREATE INDEX idx_detections_patient_id ON detections(patient_id);
CREATE INDEX idx_detections_detection_id ON detections(detection_id);
CREATE INDEX idx_caries_findings_detection_id ON caries_findings(detection_id);
CREATE INDEX idx_detection_history_patient_id ON detection_history(patient_id);
CREATE INDEX idx_detection_history_detection_id ON detection_history(detection_id);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, full_name, role) 
VALUES (
    'admin@dentalcare.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5ND2F5U.9EA/q',
    'Admin User',
    'admin'
);