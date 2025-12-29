// frontend/src/contexts/DetectionContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { detectionService } from '../services/detectionService';
import type { Detection, DetectionCreate, DetectionContextType } from '../types/detection.types';

const DetectionContext = createContext<DetectionContextType | undefined>(undefined);

export const useDetection = () => {
  const context = useContext(DetectionContext);
  if (!context) {
    throw new Error('useDetection must be used within a DetectionProvider');
  }
  return context;
};

interface DetectionProviderProps {
  children: ReactNode;
}

export const DetectionProvider: React.FC<DetectionProviderProps> = ({ children }) => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [currentDetection, setCurrentDetection] = useState<Detection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDetection = async (file: File, data: DetectionCreate): Promise<Detection> => {
    setIsLoading(true);
    setError(null);
    try {
      const detection = await detectionService.createDetection(file, data);
      setDetections((prev) => [detection, ...prev]);
      setCurrentDetection(detection);
      return detection;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to create detection';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getDetection = async (id: string): Promise<Detection> => {
    setIsLoading(true);
    setError(null);
    try {
      const detection = await detectionService.getDetection(id);
      setCurrentDetection(detection);
      return detection;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch detection';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getPatientDetections = async (patientId: string): Promise<Detection[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const patientDetections = await detectionService.getPatientDetections(patientId);
      setDetections(patientDetections);
      return patientDetections;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch detections';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value: DetectionContextType = {
    detections,
    currentDetection,
    isLoading,
    error,
    createDetection,
    getDetection,
    getPatientDetections,
    clearError,
  };

  return <DetectionContext.Provider value={value}>{children}</DetectionContext.Provider>;
};