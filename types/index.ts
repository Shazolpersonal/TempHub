export interface Template {
  id: string;
  name: string;
  category: string;
  prompt: string;
  previewImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface GenerationRequest {
  templateId: string;
  imageData: string;
}

export interface GenerationResponse {
  success: boolean;
  generatedImage?: string;
  mimeType?: string;
  error?: AppError;
}

// Error Types
export enum ErrorCode {
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  GENERATION_FAILED = 'GENERATION_FAILED',
  API_ERROR = 'API_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TEMPLATE_NOT_FOUND = 'TEMPLATE_NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
  code: ErrorCode | string;
  message: string;
  retryable: boolean;
  details?: any;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: AppError;
}

export interface TemplatesResponse {
  templates: Template[];
  total: number;
}

export interface TemplateResponse {
  template: Template;
  message?: string;
}

export interface UploadResponse {
  imageUrl: string;
  imageData: string;
}

export interface DeleteResponse {
  message: string;
}

// Form Data Types
export interface TemplateFormData {
  name: string;
  category: string;
  prompt: string;
  previewImage: string;
}
