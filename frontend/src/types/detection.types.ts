// frontend/src/types/detection.types.ts
export const ImageType = {
  INTRAORAL: 'INTRAORAL',
  BITEWING: 'BITEWING',
  PERIAPICAL: 'PERIAPICAL',
  PANORAMIC: 'PANORAMIC'
} as const;
export type ImageType = (typeof ImageType)[keyof typeof ImageType];

export const DetectionStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  REVIEWED: 'REVIEWED'
} as const;
export type DetectionStatus = (typeof DetectionStatus)[keyof typeof DetectionStatus];

export const CariesType = {
  ENAMEL: 'ENAMEL',
  DENTIN: 'DENTIN',
  PULP: 'PULP',
  CARIES: 'caries',
  CAVITY: 'cavity',
  CRACK: 'crack'
} as const;
export type CariesType = (typeof CariesType)[keyof typeof CariesType];

export const Severity = {
  MILD: 'MILD',
  MODERATE: 'MODERATE',
  SEVERE: 'SEVERE'
} as const;
export type Severity = (typeof Severity)[keyof typeof Severity];

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CariesFinding {
  id: string;
  caries_type?: CariesType;
  severity?: Severity;
  confidence_score: number;
  bounding_box: BoundingBox;
  location?: string;
  treatment_recommendation?: string;
}

export interface Detection {
  id: string;
  detection_id: string;
  patient_id: string;
  dentist_id: string;
  original_image_path: string;
  annotated_image_path?: string;
  original_image_url?: string;
  annotated_image_url?: string;
  original_image_public_id?: string;
  annotated_image_public_id?: string;
  image_type?: ImageType;
  detection_date: string;
  total_teeth_detected: number;
  total_caries_detected: number;
  processing_time_ms: number;
  confidence_threshold: number;
  status: DetectionStatus;
  notes?: string;
  caries_findings: CariesFinding[];
}

export interface DetectionCreate {
  patient_id: string;
  image_type?: ImageType;
  notes?: string;
}

export interface DetectionContextType {
  detections: Detection[];
  currentDetection: Detection | null;
  isLoading: boolean;
  error: string | null;
  createDetection: (file: File, data: DetectionCreate) => Promise<Detection>;
  getDetection: (id: string) => Promise<Detection>;
  getPatientDetections: (patientId: string) => Promise<Detection[]>;
  clearError: () => void;
}