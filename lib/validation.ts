import { ErrorCode, AppError, TemplateFormData } from '@/types';

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
];

const SUPPORTED_IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.heic',
  '.heif',
];

// Validation Result Type
export interface ValidationResult {
  isValid: boolean;
  error?: AppError;
}

/**
 * Validates file size (max 5MB)
 * Requirement 2.2, 2.3
 */
export function validateFileSize(file: File): ValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: {
        code: ErrorCode.FILE_TOO_LARGE,
        message: `File size exceeds the maximum limit of 5MB. Your file is ${formatFileSize(file.size)}.`,
        retryable: false,
        details: {
          fileSize: file.size,
          maxSize: MAX_FILE_SIZE,
        },
      },
    };
  }

  return { isValid: true };
}

/**
 * Validates file type for supported image formats
 * Requirement 2.4
 */
export function validateFileType(file: File): ValidationResult {
  const isValidType = SUPPORTED_IMAGE_TYPES.includes(file.type);
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  const isValidExtension = SUPPORTED_IMAGE_EXTENSIONS.includes(fileExtension);

  if (!isValidType && !isValidExtension) {
    return {
      isValid: false,
      error: {
        code: ErrorCode.INVALID_FILE_TYPE,
        message: `Invalid file type. Please upload a valid image file (JPG, PNG, WEBP, GIF, HEIC).`,
        retryable: false,
        details: {
          fileType: file.type,
          fileName: file.name,
          supportedTypes: SUPPORTED_IMAGE_TYPES,
        },
      },
    };
  }

  return { isValid: true };
}

/**
 * Validates uploaded image file (combines size and type validation)
 * Requirement 2.2, 2.3, 2.4
 */
export function validateImageFile(file: File): ValidationResult {
  // Check if file exists
  if (!file) {
    return {
      isValid: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'No file provided.',
        retryable: false,
      },
    };
  }

  // Validate file size
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }

  // Validate file type
  const typeValidation = validateFileType(file);
  if (!typeValidation.isValid) {
    return typeValidation;
  }

  return { isValid: true };
}

/**
 * Validates template form data
 * Requirement 5.2, 5.3, 5.5
 */
export function validateTemplateForm(data: Partial<TemplateFormData>): ValidationResult {
  const errors: string[] = [];

  // Validate name
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Template name is required.');
  } else if (data.name.trim().length < 3) {
    errors.push('Template name must be at least 3 characters long.');
  } else if (data.name.trim().length > 100) {
    errors.push('Template name must not exceed 100 characters.');
  }

  // Validate category
  if (!data.category || data.category.trim().length === 0) {
    errors.push('Category is required.');
  }

  // Validate prompt
  if (!data.prompt || data.prompt.trim().length === 0) {
    errors.push('Prompt is required.');
  } else if (data.prompt.trim().length < 10) {
    errors.push('Prompt must be at least 10 characters long.');
  } else if (data.prompt.trim().length > 5000) {
    errors.push('Prompt must not exceed 5000 characters.');
  }

  // Validate preview image
  if (!data.previewImage || data.previewImage.trim().length === 0) {
    errors.push('Preview image is required.');
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: errors.join(' '),
        retryable: false,
        details: { errors },
      },
    };
  }

  return { isValid: true };
}

/**
 * Validates template name only
 */
export function validateTemplateName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Template name is required.',
        retryable: false,
      },
    };
  }

  if (name.trim().length < 3) {
    return {
      isValid: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Template name must be at least 3 characters long.',
        retryable: false,
      },
    };
  }

  if (name.trim().length > 100) {
    return {
      isValid: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Template name must not exceed 100 characters.',
        retryable: false,
      },
    };
  }

  return { isValid: true };
}

/**
 * Validates template prompt
 */
export function validateTemplatePrompt(prompt: string): ValidationResult {
  if (!prompt || prompt.trim().length === 0) {
    return {
      isValid: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Prompt is required.',
        retryable: false,
      },
    };
  }

  if (prompt.trim().length < 10) {
    return {
      isValid: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Prompt must be at least 10 characters long.',
        retryable: false,
      },
    };
  }

  if (prompt.trim().length > 5000) {
    return {
      isValid: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Prompt must not exceed 5000 characters.',
        retryable: false,
      },
    };
  }

  return { isValid: true };
}

/**
 * Validates category selection
 */
export function validateCategory(category: string): ValidationResult {
  if (!category || category.trim().length === 0) {
    return {
      isValid: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Category is required.',
        retryable: false,
      },
    };
  }

  return { isValid: true };
}

// Error Message Generators
// Requirement 7.1

/**
 * Generates user-friendly error message for file upload errors
 */
export function getFileUploadErrorMessage(error: AppError): string {
  switch (error.code) {
    case ErrorCode.FILE_TOO_LARGE:
      return error.message || 'Image file is too large. Maximum size is 5MB.';
    case ErrorCode.INVALID_FILE_TYPE:
      return error.message || 'Invalid file type. Please upload a valid image (JPG, PNG, WEBP, GIF, HEIC).';
    case ErrorCode.UPLOAD_FAILED:
      return 'Failed to upload image. Please try again.';
    default:
      return 'An error occurred during upload. Please try again.';
  }
}

/**
 * Generates user-friendly error message for validation errors
 */
export function getValidationErrorMessage(error: AppError): string {
  return error.message || 'Validation failed. Please check your input and try again.';
}

/**
 * Generates user-friendly error message for API errors
 */
export function getApiErrorMessage(error: AppError): string {
  switch (error.code) {
    case ErrorCode.RATE_LIMIT:
      return 'Too many requests. Please try again in a few minutes.';
    case ErrorCode.API_ERROR:
      return 'API request failed. Please try again.';
    case ErrorCode.GENERATION_FAILED:
      return 'Image generation failed. Please try again with a different image.';
    case ErrorCode.NETWORK_ERROR:
      return 'Network connection issue. Please check your internet connection.';
    case ErrorCode.TEMPLATE_NOT_FOUND:
      return 'Template not found. Please select a different template.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Generates a generic user-friendly error message
 */
export function getErrorMessage(error: AppError): string {
  if (error.code === ErrorCode.FILE_TOO_LARGE || error.code === ErrorCode.INVALID_FILE_TYPE || error.code === ErrorCode.UPLOAD_FAILED) {
    return getFileUploadErrorMessage(error);
  }

  if (error.code === ErrorCode.VALIDATION_ERROR) {
    return getValidationErrorMessage(error);
  }

  return getApiErrorMessage(error);
}

// Utility Functions

/**
 * Formats file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Checks if error is retryable
 */
export function isRetryableError(error: AppError): boolean {
  return error.retryable === true;
}

/**
 * Gets supported file types as accept string for input element
 */
export function getSupportedFileTypesString(): string {
  return SUPPORTED_IMAGE_TYPES.join(',');
}

/**
 * Gets max file size in MB
 */
export function getMaxFileSizeMB(): number {
  return MAX_FILE_SIZE / (1024 * 1024);
}
