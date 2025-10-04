# Error Handling Guide

This document describes the comprehensive error handling implementation across the TempHub application.

## Overview

The application implements multiple layers of error handling to ensure a robust user experience:

1. **React Error Boundaries** - Catch React component errors
2. **API Route Error Handling** - Try-catch blocks in all API endpoints
3. **Client-Side Validation** - Prevent invalid requests before they reach the server
4. **User-Friendly Error Messages** - Convert technical errors to readable messages
5. **Retry Logic** - Automatic retry for transient errors
6. **Error Logging** - Console logging in development for debugging

## Error Codes

The application uses standardized error codes defined in `types/index.ts`:

```typescript
enum ErrorCode {
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
```

## Error Handling Layers

### 1. React Error Boundaries

**Location:** `components/error-boundary.tsx`

**Purpose:** Catch errors in React component tree and display fallback UI

**Usage:**
```tsx
import { ErrorBoundary } from '@/components/error-boundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

**Features:**
- Catches rendering errors
- Logs errors to console in development
- Displays user-friendly error message
- Provides retry button to reset error state
- Can be customized with fallback prop

**Implemented in:**
- Root layout (`app/layout.tsx`)
- Public pages (`app/(public)/error.tsx`)
- Admin pages (`app/admin/error.tsx`)
- Global error handler (`app/global-error.tsx`)

### 2. API Route Error Handling

All API routes implement try-catch blocks with consistent error responses.

**Pattern:**
```typescript
export async function POST(request: NextRequest) {
  try {
    // API logic here
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.API_ERROR,
          message: 'User-friendly error message',
          retryable: true,
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
```

**Implemented in:**
- `/api/templates` - Template CRUD operations
- `/api/templates/[id]` - Single template operations
- `/api/upload` - Image upload handling
- `/api/generate` - AI image generation

### 3. Client-Side Validation

**Location:** `lib/validation.ts`

**Purpose:** Validate user input before sending to server

**Functions:**
- `validateImageFile(file)` - Validates file size and type
- `validateFileSize(file)` - Checks 5MB limit
- `validateFileType(file)` - Checks supported formats
- `validateTemplateForm(data)` - Validates template creation/edit
- `validateTemplateName(name)` - Validates template name
- `validateTemplatePrompt(prompt)` - Validates prompt text
- `validateCategory(category)` - Validates category selection

**Example:**
```typescript
const validation = validateImageFile(file);
if (!validation.isValid) {
  // Display error to user
  console.error(validation.error.message);
  return;
}
```

### 4. Error Display Component

**Location:** `components/error-display.tsx`

**Purpose:** Display user-friendly error messages with retry option

**Props:**
```typescript
interface ErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
}
```

**Features:**
- Maps error codes to user-friendly messages
- Shows retry button for retryable errors
- Styled with Tailwind CSS
- Accessible design

### 5. Gemini API Error Handling

**Location:** `lib/gemini.ts`

**Purpose:** Handle Gemini API-specific errors

**Error Types Handled:**
- Rate limit errors (429)
- Invalid request errors (400)
- Authentication errors (401, 403)
- Network errors (ENOTFOUND, ETIMEDOUT, etc.)
- Server errors (500+)
- Unknown errors

**Function:** `handleGeminiError(error)`

Maps API errors to standardized AppError format with appropriate error codes and user-friendly messages.

### 6. Retry Logic

**Location:** `app/api/generate/route.ts`

**Purpose:** Automatically retry failed requests for transient errors

**Configuration:**
- Max retries: 3
- Base delay: 1 second
- Backoff multiplier: 2 (exponential backoff)

**Implementation:**
```typescript
async function generateImageWithRetry(prompt, imageData) {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const result = await generateImage(prompt, imageData);
    
    if (result.success || !result.error?.retryable) {
      return result;
    }
    
    // Wait with exponential backoff
    await sleep(RETRY_DELAY_MS * Math.pow(RETRY_BACKOFF_MULTIPLIER, attempt));
  }
}
```

## Error Scenarios and Handling

### File Upload Errors

| Scenario | Error Code | Status | Retryable | Message |
|----------|-----------|--------|-----------|---------|
| File > 5MB | FILE_TOO_LARGE | 400 | No | "File size exceeds the maximum limit of 5MB" |
| Invalid type | INVALID_FILE_TYPE | 400 | No | "Invalid file type. Please upload a valid image" |
| No file | VALIDATION_ERROR | 400 | No | "No image file provided" |
| Upload failed | UPLOAD_FAILED | 500 | Yes | "Failed to upload image. Please try again" |

### Template Errors

| Scenario | Error Code | Status | Retryable | Message |
|----------|-----------|--------|-----------|---------|
| Template not found | TEMPLATE_NOT_FOUND | 404 | No | "Template not found" |
| Missing fields | VALIDATION_ERROR | 400 | No | "Template name is required" (etc.) |
| Create failed | API_ERROR | 500 | Yes | "Failed to create template" |
| Update failed | API_ERROR | 500 | Yes | "Failed to update template" |
| Delete failed | API_ERROR | 500 | Yes | "Failed to delete template" |

### Generation Errors

| Scenario | Error Code | Status | Retryable | Message |
|----------|-----------|--------|-----------|---------|
| Rate limit | RATE_LIMIT | 429 | Yes | "API rate limit exceeded. Please try again later" |
| Invalid request | VALIDATION_ERROR | 400 | Yes | "Invalid image or prompt" |
| API error | API_ERROR | 502 | Yes | "Gemini API is temporarily unavailable" |
| Network error | NETWORK_ERROR | 503 | Yes | "Network connection issue" |
| Generation failed | GENERATION_FAILED | 500 | No | "Failed to generate image after multiple attempts" |

### Network Errors

| Scenario | Error Code | Status | Retryable | Message |
|----------|-----------|--------|-----------|---------|
| Connection refused | NETWORK_ERROR | 503 | Yes | "Network connection issue" |
| Timeout | NETWORK_ERROR | 503 | Yes | "Request timed out" |
| DNS error | NETWORK_ERROR | 503 | Yes | "Cannot reach server" |

## Testing Error Handling

### Manual Testing

1. **File Upload Errors:**
   - Upload file > 5MB
   - Upload non-image file (e.g., .txt, .pdf)
   - Submit without selecting file

2. **Template Errors:**
   - Try to access non-existent template
   - Create template with empty fields
   - Update non-existent template
   - Delete non-existent template

3. **Generation Errors:**
   - Generate with invalid template ID
   - Generate without uploading image
   - Test with invalid API key (if possible)

4. **Network Errors:**
   - Disconnect internet and try operations
   - Use browser dev tools to throttle network

### Automated Testing

Run the error handling test suite:

```bash
node test-error-handling.mjs
```

This script tests:
- Invalid template IDs
- Missing required fields
- Invalid file types
- Files too large
- Missing images
- Generation errors
- Update/delete non-existent templates
- Network errors

## Error Logging

### Development Mode

All errors are logged to the console with detailed information:

```typescript
if (process.env.NODE_ENV === 'development') {
  console.error('Error details:', error);
  console.error('Stack trace:', error.stack);
}
```

### Production Mode

In production, errors are logged without sensitive information. Consider integrating with error tracking services like:
- Sentry
- LogRocket
- Rollbar
- Bugsnag

**Example integration:**
```typescript
if (process.env.NODE_ENV === 'production') {
  // Send to error tracking service
  errorTrackingService.captureException(error, {
    context: 'API Route',
    endpoint: '/api/generate',
    userId: 'anonymous',
  });
}
```

## Best Practices

1. **Always use try-catch in API routes**
   - Wrap all async operations
   - Return consistent error format
   - Include appropriate HTTP status codes

2. **Validate on both client and server**
   - Client validation for UX
   - Server validation for security

3. **Provide user-friendly messages**
   - Avoid technical jargon
   - Explain what went wrong
   - Suggest how to fix it

4. **Make errors actionable**
   - Show retry button for retryable errors
   - Provide alternative actions
   - Link to help documentation

5. **Log errors appropriately**
   - Development: Detailed logs
   - Production: Sanitized logs
   - Never log sensitive data

6. **Use Error Boundaries**
   - Wrap components that might fail
   - Provide fallback UI
   - Allow recovery when possible

7. **Handle edge cases**
   - Network failures
   - API rate limits
   - Invalid data
   - Missing resources

## Error Response Format

All API errors follow this consistent format:

```typescript
{
  success: false,
  error: {
    code: ErrorCode,
    message: string,
    retryable: boolean,
    details?: any
  }
}
```

## Requirements Coverage

This error handling implementation satisfies the following requirements:

- **7.1** - Specific error messages for upload failures
- **7.2** - Rate limit detection and user notification
- **7.3** - Gemini API error handling with retry
- **7.4** - Network connectivity error detection
- **7.5** - Error logging for debugging

## Future Enhancements

1. **Error Tracking Service Integration**
   - Implement Sentry or similar service
   - Track error frequency and patterns
   - Set up alerts for critical errors

2. **User Error Reporting**
   - Allow users to report errors
   - Include context and screenshots
   - Track user-reported issues

3. **Error Analytics**
   - Dashboard for error metrics
   - Identify common error patterns
   - Monitor error rates over time

4. **Improved Retry Logic**
   - Adaptive retry delays
   - Circuit breaker pattern
   - Fallback strategies

5. **Offline Support**
   - Detect offline state
   - Queue operations for later
   - Sync when connection restored
