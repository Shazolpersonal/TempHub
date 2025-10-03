# Generation Progress Component - Test Documentation

## Component Overview
The `GenerationProgress` component displays the status of AI image generation with appropriate UI for each state.

## Requirements Coverage

### ✅ Requirement 3.2: Display loading indicator during generation
- Implemented with `Loader2` spinning icon
- Shows "Uploading Image..." or "Generating Your Image..." based on status
- Includes helpful message: "This may take a few moments. Please don't close this page."

### ✅ Requirement 3.4: Provide download button for generated image
- Download button appears in success state
- Full-width button with download icon
- Calls `onDownload` callback when clicked

### ✅ Requirement 3.5: Display generated image to user
- Generated image displayed in aspect-square container
- Image uses object-contain to preserve aspect ratio
- Success state shows green banner with "Generation Complete!" message

### ✅ Requirement 7.2: Display error reason and provide retry button
- Error state shows AlertCircle icon with error message
- Retry button appears when `error.retryable` is true
- Calls `onRetry` callback when clicked

### ✅ Requirement 7.3: Inform user about rate limits
- `getErrorMessage` function maps RATE_LIMIT error code
- Message: "Too many requests. Please wait a few minutes and try again."

### ✅ Requirement 7.4: Detect and inform about network connectivity issues
- `getErrorMessage` function maps NETWORK_ERROR error code
- Message: "Network connection issue. Please check your internet and try again."

## Component States

### 1. Idle State
- Returns `null` (nothing rendered)
- Used when no operation is in progress

### 2. Uploading State
- Shows loading spinner
- Displays "Uploading Image..." heading
- Message: "Please wait while we process your image"
- Optional progress bar if `progress` prop provided

### 3. Generating State
- Shows loading spinner
- Displays "Generating Your Image..." heading
- Message: "This may take a few moments. Please don't close this page."
- Optional progress bar if `progress` prop provided

### 4. Complete State
- Shows success banner with CheckCircle2 icon
- Displays generated image in responsive container
- Shows download button with Download icon

### 5. Error State
- Shows error container with destructive styling
- Displays AlertCircle icon
- Shows error heading "Generation Failed"
- Displays user-friendly error message
- Shows retry button if error is retryable

## Props Interface

```typescript
interface GenerationProgressProps {
  status: GenerationStatus;           // Current operation status
  progress?: number;                  // Optional progress percentage (0-100)
  error?: AppError;                   // Error object if status is 'error'
  generatedImage?: string;            // Base64 or URL of generated image
  onRetry?: () => void;              // Callback for retry button
  onDownload?: () => void;           // Callback for download button
}

type GenerationStatus = 'idle' | 'uploading' | 'generating' | 'complete' | 'error';
```

## Error Message Mapping

The component maps all error codes to user-friendly messages:

- `FILE_TOO_LARGE`: "The image file is too large. Maximum size is 5MB."
- `INVALID_FILE_TYPE`: "Invalid file type. Please upload a valid image (JPG, PNG, WEBP)."
- `UPLOAD_FAILED`: "Failed to upload the image. Please try again."
- `GENERATION_FAILED`: "Failed to generate the image. Please try again."
- `RATE_LIMIT`: "Too many requests. Please wait a few minutes and try again."
- `NETWORK_ERROR`: "Network connection issue. Please check your internet and try again."
- `TEMPLATE_NOT_FOUND`: "Template not found. Please select a different template."
- `API_ERROR`: "An error occurred with the AI service. Please try again."
- Default: Uses error.message or generic fallback

## Usage Example

```tsx
import { GenerationProgress } from '@/components/generation-progress';
import { useState } from 'react';

function TemplatePage() {
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [generatedImage, setGeneratedImage] = useState<string>();
  const [error, setError] = useState<AppError>();

  const handleGenerate = async () => {
    setStatus('uploading');
    // Upload logic...
    
    setStatus('generating');
    // Generation logic...
    
    setStatus('complete');
    setGeneratedImage('data:image/png;base64,...');
  };

  const handleRetry = () => {
    setStatus('idle');
    setError(undefined);
    handleGenerate();
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generatedImage!;
    link.download = 'generated-image.png';
    link.click();
  };

  return (
    <GenerationProgress
      status={status}
      error={error}
      generatedImage={generatedImage}
      onRetry={handleRetry}
      onDownload={handleDownload}
    />
  );
}
```

## Styling Features

- Responsive design with max-w-2xl container
- Uses Tailwind CSS utility classes
- Supports dark mode with dark: variants
- Smooth transitions for progress bar
- Accessible color contrast for error states
- Loading spinner animation with animate-spin
