import { NextRequest, NextResponse } from 'next/server';
import { ErrorCode, UploadResponse, AppError } from '@/types';

/**
 * POST /api/upload
 * Handles user image upload for AI generation
 * Requirements: 2.2, 2.3, 2.4, 2.5
 */
export async function POST(request: NextRequest) {
  try {
    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('image') as File;

    // Validate file exists
    if (!file) {
      const error: AppError = {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'No image file provided.',
        retryable: false,
      };
      return NextResponse.json(
        { success: false, error },
        { status: 400 }
      );
    }

    // Validate file size (5MB max) - Requirement 2.2, 2.3
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      const error: AppError = {
        code: ErrorCode.FILE_TOO_LARGE,
        message: `File size exceeds the maximum limit of 5MB. Your file is ${formatFileSize(file.size)}.`,
        retryable: false,
        details: {
          fileSize: file.size,
          maxSize: MAX_FILE_SIZE,
        },
      };
      return NextResponse.json(
        { success: false, error },
        { status: 400 }
      );
    }

    // Validate file type - Requirement 2.4
    const SUPPORTED_IMAGE_TYPES = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/heic',
      'image/heif',
    ];

    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      const error: AppError = {
        code: ErrorCode.INVALID_FILE_TYPE,
        message: 'Invalid file type. Please upload a valid image file (JPG, PNG, WEBP, GIF, HEIC).',
        retryable: false,
        details: {
          fileType: file.type,
          fileName: file.name,
          supportedTypes: SUPPORTED_IMAGE_TYPES,
        },
      };
      return NextResponse.json(
        { success: false, error },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert to base64 for API usage
    const base64 = buffer.toString('base64');
    const mimeType = file.type;
    
    // Create data URL for temporary display - Requirement 2.5
    const imageUrl = `data:${mimeType};base64,${base64}`;
    
    // Return temporary image data for generation
    const response: UploadResponse = {
      imageUrl, // For preview display
      imageData: base64, // For API usage
    };

    return NextResponse.json(
      { success: true, data: response },
      { status: 200 }
    );

  } catch (error) {
    console.error('Upload error:', error);
    
    const appError: AppError = {
      code: ErrorCode.UPLOAD_FAILED,
      message: 'Failed to upload image. Please try again.',
      retryable: true,
      details: error instanceof Error ? error.message : 'Unknown error',
    };

    return NextResponse.json(
      { success: false, error: appError },
      { status: 500 }
    );
  }
}

/**
 * Formats file size in human-readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
