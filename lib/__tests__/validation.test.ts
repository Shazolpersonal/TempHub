import { describe, it, expect } from 'vitest';
import {
  validateFileSize,
  validateFileType,
  validateImageFile,
  validateTemplateForm,
  validateTemplateName,
  validateTemplatePrompt,
  validateCategory,
  formatFileSize,
  isRetryableError,
  getMaxFileSizeMB,
  getSupportedFileTypesString,
  getFileUploadErrorMessage,
  getValidationErrorMessage,
  getApiErrorMessage,
  getErrorMessage,
} from '../validation';
import { ErrorCode } from '@/types';

describe('validation.ts', () => {
  describe('validateFileSize', () => {
    it('should pass for files under 5MB', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
      
      const result = validateFileSize(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should fail for files over 5MB', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 }); // 6MB
      
      const result = validateFileSize(file);
      expect(result.isValid).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.FILE_TOO_LARGE);
      expect(result.error?.retryable).toBe(false);
    });

    it('should pass for files exactly at 5MB limit', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 5 * 1024 * 1024 }); // 5MB
      
      const result = validateFileSize(file);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateFileType', () => {
    it('should pass for valid JPEG file', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = validateFileType(file);
      expect(result.isValid).toBe(true);
    });

    it('should pass for valid PNG file', () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const result = validateFileType(file);
      expect(result.isValid).toBe(true);
    });

    it('should pass for valid WEBP file', () => {
      const file = new File(['test'], 'test.webp', { type: 'image/webp' });
      const result = validateFileType(file);
      expect(result.isValid).toBe(true);
    });

    it('should fail for invalid file type', () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      const result = validateFileType(file);
      expect(result.isValid).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.INVALID_FILE_TYPE);
    });

    it('should validate by extension when mime type is missing', () => {
      const file = new File(['test'], 'test.jpg', { type: '' });
      const result = validateFileType(file);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateImageFile', () => {
    it('should pass for valid image file', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
      
      const result = validateImageFile(file);
      expect(result.isValid).toBe(true);
    });

    it('should fail when no file provided', () => {
      const result = validateImageFile(null as any);
      expect(result.isValid).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.VALIDATION_ERROR);
    });

    it('should fail for oversized file', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 }); // 10MB
      
      const result = validateImageFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.FILE_TOO_LARGE);
    });

    it('should fail for invalid file type', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      Object.defineProperty(file, 'size', { value: 1024 }); // 1KB
      
      const result = validateImageFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.INVALID_FILE_TYPE);
    });
  });

  describe('validateTemplateForm', () => {
    it('should pass for valid template data', () => {
      const data = {
        name: 'Test Template',
        category: 'product',
        prompt: 'This is a valid prompt with enough characters',
        previewImage: '/path/to/image.jpg',
      };
      
      const result = validateTemplateForm(data);
      expect(result.isValid).toBe(true);
    });

    it('should fail when name is missing', () => {
      const data = {
        name: '',
        category: 'product',
        prompt: 'Valid prompt',
        previewImage: '/path/to/image.jpg',
      };
      
      const result = validateTemplateForm(data);
      expect(result.isValid).toBe(false);
      expect(result.error?.message).toContain('name is required');
    });

    it('should fail when name is too short', () => {
      const data = {
        name: 'ab',
        category: 'product',
        prompt: 'Valid prompt',
        previewImage: '/path/to/image.jpg',
      };
      
      const result = validateTemplateForm(data);
      expect(result.isValid).toBe(false);
      expect(result.error?.message).toContain('at least 3 characters');
    });

    it('should fail when category is missing', () => {
      const data = {
        name: 'Test Template',
        category: '',
        prompt: 'Valid prompt',
        previewImage: '/path/to/image.jpg',
      };
      
      const result = validateTemplateForm(data);
      expect(result.isValid).toBe(false);
      expect(result.error?.message).toContain('Category is required');
    });

    it('should fail when prompt is too short', () => {
      const data = {
        name: 'Test Template',
        category: 'product',
        prompt: 'short',
        previewImage: '/path/to/image.jpg',
      };
      
      const result = validateTemplateForm(data);
      expect(result.isValid).toBe(false);
      expect(result.error?.message).toContain('at least 10 characters');
    });

    it('should fail when preview image is missing', () => {
      const data = {
        name: 'Test Template',
        category: 'product',
        prompt: 'Valid prompt with enough characters',
        previewImage: '',
      };
      
      const result = validateTemplateForm(data);
      expect(result.isValid).toBe(false);
      expect(result.error?.message).toContain('Preview image is required');
    });
  });

  describe('validateTemplateName', () => {
    it('should pass for valid name', () => {
      const result = validateTemplateName('Valid Template Name');
      expect(result.isValid).toBe(true);
    });

    it('should fail for empty name', () => {
      const result = validateTemplateName('');
      expect(result.isValid).toBe(false);
    });

    it('should fail for name too short', () => {
      const result = validateTemplateName('ab');
      expect(result.isValid).toBe(false);
    });

    it('should fail for name too long', () => {
      const result = validateTemplateName('a'.repeat(101));
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateTemplatePrompt', () => {
    it('should pass for valid prompt', () => {
      const result = validateTemplatePrompt('This is a valid prompt with enough characters');
      expect(result.isValid).toBe(true);
    });

    it('should fail for empty prompt', () => {
      const result = validateTemplatePrompt('');
      expect(result.isValid).toBe(false);
    });

    it('should fail for prompt too short', () => {
      const result = validateTemplatePrompt('short');
      expect(result.isValid).toBe(false);
    });

    it('should fail for prompt too long', () => {
      const result = validateTemplatePrompt('a'.repeat(5001));
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateCategory', () => {
    it('should pass for valid category', () => {
      const result = validateCategory('product');
      expect(result.isValid).toBe(true);
    });

    it('should fail for empty category', () => {
      const result = validateCategory('');
      expect(result.isValid).toBe(false);
    });
  });

  describe('formatFileSize', () => {
    it('should format 0 bytes', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
    });

    it('should format bytes', () => {
      expect(formatFileSize(500)).toBe('500 Bytes');
    });

    it('should format kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
    });

    it('should format megabytes', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
    });

    it('should format with decimals', () => {
      expect(formatFileSize(1536 * 1024)).toBe('1.5 MB');
    });
  });

  describe('isRetryableError', () => {
    it('should return true for retryable errors', () => {
      const error = {
        code: ErrorCode.NETWORK_ERROR,
        message: 'Network error',
        retryable: true,
      };
      expect(isRetryableError(error)).toBe(true);
    });

    it('should return false for non-retryable errors', () => {
      const error = {
        code: ErrorCode.FILE_TOO_LARGE,
        message: 'File too large',
        retryable: false,
      };
      expect(isRetryableError(error)).toBe(false);
    });
  });

  describe('getMaxFileSizeMB', () => {
    it('should return 5', () => {
      expect(getMaxFileSizeMB()).toBe(5);
    });
  });

  describe('getSupportedFileTypesString', () => {
    it('should return comma-separated mime types', () => {
      const result = getSupportedFileTypesString();
      expect(result).toContain('image/jpeg');
      expect(result).toContain('image/png');
      expect(result).toContain('image/webp');
    });
  });

  describe('getFileUploadErrorMessage', () => {
    it('should return message for FILE_TOO_LARGE', () => {
      const error = {
        code: ErrorCode.FILE_TOO_LARGE,
        message: 'Custom message',
        retryable: false,
      };
      expect(getFileUploadErrorMessage(error)).toBe('Custom message');
    });

    it('should return default message for UPLOAD_FAILED', () => {
      const error = {
        code: ErrorCode.UPLOAD_FAILED,
        message: '',
        retryable: true,
      };
      expect(getFileUploadErrorMessage(error)).toContain('Failed to upload');
    });
  });

  describe('getValidationErrorMessage', () => {
    it('should return error message', () => {
      const error = {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Validation failed',
        retryable: false,
      };
      expect(getValidationErrorMessage(error)).toBe('Validation failed');
    });
  });

  describe('getApiErrorMessage', () => {
    it('should return message for RATE_LIMIT', () => {
      const error = {
        code: ErrorCode.RATE_LIMIT,
        message: '',
        retryable: true,
      };
      expect(getApiErrorMessage(error)).toContain('Too many requests');
    });

    it('should return message for NETWORK_ERROR', () => {
      const error = {
        code: ErrorCode.NETWORK_ERROR,
        message: '',
        retryable: true,
      };
      expect(getApiErrorMessage(error)).toContain('Network connection');
    });
  });

  describe('getErrorMessage', () => {
    it('should route file upload errors correctly', () => {
      const error = {
        code: ErrorCode.FILE_TOO_LARGE,
        message: 'Too large',
        retryable: false,
      };
      expect(getErrorMessage(error)).toBe('Too large');
    });

    it('should route validation errors correctly', () => {
      const error = {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Invalid',
        retryable: false,
      };
      expect(getErrorMessage(error)).toBe('Invalid');
    });

    it('should route API errors correctly', () => {
      const error = {
        code: ErrorCode.API_ERROR,
        message: '',
        retryable: true,
      };
      expect(getErrorMessage(error)).toContain('API request failed');
    });
  });
});
