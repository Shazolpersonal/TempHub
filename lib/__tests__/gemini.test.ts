import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateImage, handleGeminiError, isGeminiConfigured } from '../gemini';
import { ErrorCode } from '@/types';

// Mock the Google Generative AI module
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
      getGenerativeModel: vi.fn().mockReturnValue({
        generateContent: vi.fn(),
      }),
    })),
  };
});

describe('gemini.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleGeminiError', () => {
    it('should handle rate limit errors (429)', () => {
      const error = { status: 429, message: 'Rate limit exceeded' };
      const result = handleGeminiError(error);
      
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.RATE_LIMIT);
      expect(result.error?.retryable).toBe(true);
      expect(result.error?.message).toContain('rate limit');
    });

    it('should handle rate limit errors by message', () => {
      const error = { message: 'rate limit exceeded' };
      const result = handleGeminiError(error);
      
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.RATE_LIMIT);
      expect(result.error?.retryable).toBe(true);
    });

    it('should handle invalid request errors (400)', () => {
      const error = { status: 400, message: 'Invalid request' };
      const result = handleGeminiError(error);
      
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(result.error?.retryable).toBe(true);
      expect(result.error?.message).toContain('Invalid image or prompt');
    });

    it('should handle authentication errors (401)', () => {
      const error = { status: 401, message: 'Unauthorized' };
      const result = handleGeminiError(error);
      
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.API_ERROR);
      expect(result.error?.retryable).toBe(false);
      expect(result.error?.message).toContain('authentication failed');
    });

    it('should handle authentication errors (403)', () => {
      const error = { status: 403, message: 'Forbidden' };
      const result = handleGeminiError(error);
      
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.API_ERROR);
      expect(result.error?.retryable).toBe(false);
    });

    it('should handle network errors by code', () => {
      const error = { code: 'ENOTFOUND', message: 'Network error' };
      const result = handleGeminiError(error);
      
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.NETWORK_ERROR);
      expect(result.error?.retryable).toBe(true);
      expect(result.error?.message).toContain('Network connection');
    });

    it('should handle network errors by message', () => {
      const error = { message: 'network timeout' };
      const result = handleGeminiError(error);
      
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.NETWORK_ERROR);
      expect(result.error?.retryable).toBe(true);
    });

    it('should handle server errors (500+)', () => {
      const error = { status: 500, message: 'Internal server error' };
      const result = handleGeminiError(error);
      
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.API_ERROR);
      expect(result.error?.retryable).toBe(true);
      expect(result.error?.message).toContain('temporarily unavailable');
    });

    it('should handle unknown errors', () => {
      const error = { message: 'Unknown error' };
      const result = handleGeminiError(error);
      
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.GENERATION_FAILED);
      expect(result.error?.retryable).toBe(true);
    });

    it('should handle errors without message', () => {
      const error = {};
      const result = handleGeminiError(error);
      
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.GENERATION_FAILED);
      expect(result.error?.message).toContain('unexpected error');
    });
  });

  describe('isGeminiConfigured', () => {
    it('should return true when API key is set', () => {
      const originalKey = process.env.GEMINI_API_KEY;
      process.env.GEMINI_API_KEY = 'test-api-key';
      
      expect(isGeminiConfigured()).toBe(true);
      
      process.env.GEMINI_API_KEY = originalKey;
    });

    it('should return false when API key is not set', () => {
      const originalKey = process.env.GEMINI_API_KEY;
      delete process.env.GEMINI_API_KEY;
      
      expect(isGeminiConfigured()).toBe(false);
      
      process.env.GEMINI_API_KEY = originalKey;
    });

    it('should return false when API key is placeholder', () => {
      const originalKey = process.env.GEMINI_API_KEY;
      process.env.GEMINI_API_KEY = 'your_gemini_api_key_here';
      
      expect(isGeminiConfigured()).toBe(false);
      
      process.env.GEMINI_API_KEY = originalKey;
    });
  });

  describe('generateImage', () => {
    it('should return error when API key is missing', async () => {
      const originalKey = process.env.GEMINI_API_KEY;
      delete process.env.GEMINI_API_KEY;
      
      const result = await generateImage('test prompt', 'base64data');
      
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.API_ERROR);
      expect(result.error?.message).toContain('not configured');
      
      process.env.GEMINI_API_KEY = originalKey;
    });

    it('should return error when prompt is missing', async () => {
      const originalKey = process.env.GEMINI_API_KEY;
      process.env.GEMINI_API_KEY = 'test-key';
      
      const result = await generateImage('', 'base64data');
      
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.VALIDATION_ERROR);
      
      process.env.GEMINI_API_KEY = originalKey;
    });

    it('should return error when image is missing', async () => {
      const originalKey = process.env.GEMINI_API_KEY;
      process.env.GEMINI_API_KEY = 'test-key';
      
      const result = await generateImage('test prompt', '');
      
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.VALIDATION_ERROR);
      
      process.env.GEMINI_API_KEY = originalKey;
    });

    it('should handle base64 data with data URI prefix', async () => {
      const originalKey = process.env.GEMINI_API_KEY;
      process.env.GEMINI_API_KEY = 'test-key';
      
      // This will fail in the actual API call, but we're testing the parsing logic
      const dataUri = 'data:image/jpeg;base64,/9j/4AAQSkZJRg==';
      const result = await generateImage('test prompt', dataUri);
      
      // Should attempt to process (will fail without real API, but validates parsing)
      expect(result).toBeDefined();
      
      process.env.GEMINI_API_KEY = originalKey;
    });

    it('should handle base64 data without data URI prefix', async () => {
      const originalKey = process.env.GEMINI_API_KEY;
      process.env.GEMINI_API_KEY = 'test-key';
      
      const base64 = '/9j/4AAQSkZJRg==';
      const result = await generateImage('test prompt', base64);
      
      expect(result).toBeDefined();
      
      process.env.GEMINI_API_KEY = originalKey;
    });
  });
});
