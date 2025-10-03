/**
 * Image Generation API Endpoint
 * 
 * This endpoint handles AI image generation requests using the Gemini API.
 * It fetches the template prompt and combines it with the user's uploaded image
 * to generate a new AI-powered image.
 * 
 * Includes retry logic for transient errors (network issues, rate limits, etc.)
 * 
 * Requirements: 3.1, 3.3, 3.6, 3.7, 7.2, 7.3
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTemplateById } from '@/lib/templates';
import { generateImage } from '@/lib/gemini';
import { GenerationRequest, GenerationResponse, ErrorCode } from '@/types';

// Configuration for retry logic
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000; // 1 second base delay
const RETRY_BACKOFF_MULTIPLIER = 2; // Exponential backoff

/**
 * POST /api/generate
 * Generate an AI image using a template and user-uploaded image
 * 
 * Request body:
 * - templateId: string - The ID of the template to use
 * - imageData: string - Base64 encoded image data
 * 
 * Response:
 * - success: boolean
 * - generatedImage?: string - Base64 encoded generated image
 * - mimeType?: string - MIME type of the generated image
 * - error?: AppError - Error details if generation failed
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: GenerationRequest = await request.json();
    const { templateId, imageData } = body;

    // Validate request data
    if (!templateId || !imageData) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: 'Template ID and image data are required',
            retryable: false,
          },
        },
        { status: 400 }
      );
    }

    // Fetch template by ID
    const template = await getTemplateById(templateId);

    if (!template) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.TEMPLATE_NOT_FOUND,
            message: 'Template not found',
            retryable: false,
          },
        },
        { status: 404 }
      );
    }

    // Call Gemini API with retry logic for transient errors
    const result = await generateImageWithRetry(template.prompt, imageData);

    // Handle generation failure
    if (!result.success) {
      const statusCode = getStatusCodeFromError(result.error?.code);
      return NextResponse.json(result, { status: statusCode });
    }

    // Return successful response
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Error in generate endpoint:', error);

    // Handle unexpected errors
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.GENERATION_FAILED,
          message: 'An unexpected error occurred during image generation',
          retryable: true,
          details: error.message,
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Generate image with automatic retry logic for transient errors
 * Implements exponential backoff for retryable errors
 * 
 * @param prompt - Template prompt for image generation
 * @param imageData - Base64 encoded user image
 * @returns GenerationResponse with result or error
 */
async function generateImageWithRetry(
  prompt: string,
  imageData: string
): Promise<GenerationResponse> {
  let lastError: GenerationResponse | null = null;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Attempt to generate image
      const result = await generateImage(prompt, imageData);
      
      // If successful, return immediately
      if (result.success) {
        return result;
      }
      
      // If error is not retryable, return immediately
      if (!result.error?.retryable) {
        return result;
      }
      
      // Store the error for potential return
      lastError = result;
      
      // If this is not the last attempt, wait before retrying
      if (attempt < MAX_RETRIES - 1) {
        const delay = RETRY_DELAY_MS * Math.pow(RETRY_BACKOFF_MULTIPLIER, attempt);
        console.log(`Retry attempt ${attempt + 1}/${MAX_RETRIES} after ${delay}ms delay`);
        await sleep(delay);
      }
    } catch (error: any) {
      console.error(`Error on attempt ${attempt + 1}:`, error);
      
      // If this is the last attempt, return the error
      if (attempt === MAX_RETRIES - 1) {
        return {
          success: false,
          error: {
            code: ErrorCode.GENERATION_FAILED,
            message: 'Failed to generate image after multiple attempts',
            retryable: false,
            details: error.message,
          },
        };
      }
      
      // Wait before retrying
      const delay = RETRY_DELAY_MS * Math.pow(RETRY_BACKOFF_MULTIPLIER, attempt);
      await sleep(delay);
    }
  }
  
  // Return the last error if all retries failed
  return lastError || {
    success: false,
    error: {
      code: ErrorCode.GENERATION_FAILED,
      message: 'Failed to generate image after multiple attempts',
      retryable: false,
    },
  };
}

/**
 * Helper function to sleep for a specified duration
 * @param ms - Milliseconds to sleep
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Helper function to map error codes to HTTP status codes
 */
function getStatusCodeFromError(errorCode?: string): number {
  switch (errorCode) {
    case ErrorCode.VALIDATION_ERROR:
      return 400;
    case ErrorCode.TEMPLATE_NOT_FOUND:
      return 404;
    case ErrorCode.RATE_LIMIT:
      return 429;
    case ErrorCode.API_ERROR:
      return 502;
    case ErrorCode.NETWORK_ERROR:
      return 503;
    default:
      return 500;
  }
}
