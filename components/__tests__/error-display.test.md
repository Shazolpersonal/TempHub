# Error Display Component Test Documentation

## Component Overview
The ErrorDisplay component provides user-friendly error messages with optional retry functionality.

## Test Scenarios

### 1. File Too Large Error
```tsx
<ErrorDisplay 
  error={{
    code: ErrorCode.FILE_TOO_LARGE,
    message: 'File exceeds 5MB',
    retryable: true
  }}
  onRetry={() => console.log('Retry clicked')}
/>
```
**Expected**: Shows "File Too Large" title with message about 5MB limit and retry button.

### 2. Invalid File Type Error
```tsx
<ErrorDisplay 
  error={{
    code: ErrorCode.INVALID_FILE_TYPE,
    message: 'Unsupported format',
    retryable: true
  }}
  onRetry={() => console.log('Retry clicked')}
/>
```
**Expected**: Shows "Invalid File Type" title with supported formats message and retry button.

### 3. Rate Limit Error
```tsx
<ErrorDisplay 
  error={{
    code: ErrorCode.RATE_LIMIT,
    message: 'Too many requests',
    retryable: true
  }}
  onRetry={() => console.log('Retry clicked')}
/>
```
**Expected**: Shows "Rate Limit Exceeded" title with wait message and retry button.

### 4. Network Error
```tsx
<ErrorDisplay 
  error={{
    code: ErrorCode.NETWORK_ERROR,
    message: 'Connection failed',
    retryable: true
  }}
  onRetry={() => console.log('Retry clicked')}
/>
```
**Expected**: Shows "Network Error" title with connection check message and retry button.

### 5. Generation Failed Error
```tsx
<ErrorDisplay 
  error={{
    code: ErrorCode.GENERATION_FAILED,
    message: 'AI generation error',
    retryable: true
  }}
  onRetry={() => console.log('Retry clicked')}
/>
```
**Expected**: Shows "Generation Failed" title with AI service error message and retry button.

### 6. Non-Retryable Error
```tsx
<ErrorDisplay 
  error={{
    code: ErrorCode.TEMPLATE_NOT_FOUND,
    message: 'Template does not exist',
    retryable: false
  }}
/>
```
**Expected**: Shows "Template Not Found" title with message but NO retry button.

### 7. Error with Details
```tsx
<ErrorDisplay 
  error={{
    code: ErrorCode.API_ERROR,
    message: 'Server error',
    retryable: true,
    details: 'Status: 500, Endpoint: /api/generate'
  }}
  onRetry={() => console.log('Retry clicked')}
/>
```
**Expected**: Shows error message with additional details section and retry button.

### 8. Null Error
```tsx
<ErrorDisplay error={null} />
```
**Expected**: Renders nothing (null).

## Requirements Coverage

### Requirement 7.1: Upload Error Feedback
- ✅ FILE_TOO_LARGE error with specific message
- ✅ INVALID_FILE_TYPE error with supported formats

### Requirement 7.2: Rate Limit Handling
- ✅ RATE_LIMIT error with wait suggestion
- ✅ Retry button for rate limit errors

### Requirement 7.3: API Error Display
- ✅ GENERATION_FAILED error with clear message
- ✅ API_ERROR with retry option

### Requirement 7.4: Network Error Detection
- ✅ NETWORK_ERROR with connection check message
- ✅ Retry functionality for network issues

### Requirement 7.5: Error Logging
- ✅ Details field for debugging information
- ✅ Error code and message display

## Styling Features
- Uses shadcn/ui Alert component with destructive variant (red theme)
- AlertCircle icon for visual error indication
- RefreshCw icon for retry button
- Responsive design with proper spacing
- Accessible with proper ARIA roles
- Conditional retry button based on retryable flag

## Integration Example

```tsx
'use client';

import { useState } from 'react';
import { ErrorDisplay } from '@/components/error-display';
import { AppError, ErrorCode } from '@/types';

export function ImageUploadForm() {
  const [error, setError] = useState<AppError | null>(null);

  const handleUpload = async (file: File) => {
    try {
      // Upload logic
    } catch (err) {
      setError({
        code: ErrorCode.UPLOAD_FAILED,
        message: 'Failed to upload image',
        retryable: true,
        details: err.message
      });
    }
  };

  const handleRetry = () => {
    setError(null);
    // Retry logic
  };

  return (
    <div>
      <ErrorDisplay error={error} onRetry={handleRetry} />
      {/* Upload form */}
    </div>
  );
}
```

## Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| error | AppError \| null | Yes | Error object to display |
| onRetry | () => void | No | Callback function for retry button |
| className | string | No | Additional CSS classes |

## Error Code Mappings

All ErrorCode enum values are mapped to user-friendly messages:
- FILE_TOO_LARGE → "File Too Large" with 5MB limit message
- INVALID_FILE_TYPE → "Invalid File Type" with supported formats
- UPLOAD_FAILED → "Upload Failed" with connection check
- GENERATION_FAILED → "Generation Failed" with AI service message
- API_ERROR → "API Error" with server communication message
- RATE_LIMIT → "Rate Limit Exceeded" with wait suggestion
- NETWORK_ERROR → "Network Error" with connection check
- TEMPLATE_NOT_FOUND → "Template Not Found" with deletion note
- VALIDATION_ERROR → "Validation Error" with custom message
- Unknown codes → Generic "Error" with fallback message
