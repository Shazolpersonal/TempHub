# Error Handling Quick Reference

## Quick Start

### Using Error Boundaries

```tsx
import { ErrorBoundary } from '@/components/error-boundary';

// Wrap any component that might throw errors
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// Or use the HOC
const SafeComponent = withErrorBoundary(YourComponent);
```

### Displaying Errors

```tsx
import { ErrorDisplay } from '@/components/error-display';
import { ErrorCode } from '@/types';

<ErrorDisplay
  error={{
    code: ErrorCode.VALIDATION_ERROR,
    message: 'Something went wrong',
    retryable: true,
  }}
  onRetry={() => handleRetry()}
/>
```

### API Error Handling Pattern

```typescript
export async function POST(request: NextRequest) {
  try {
    // Your API logic here
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.API_ERROR,
          message: 'User-friendly message',
          retryable: true,
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
```

### Client-Side Validation

```typescript
import { validateImageFile } from '@/lib/validation';

const validation = validateImageFile(file);
if (!validation.isValid) {
  // Show error to user
  setError(validation.error);
  return;
}
// Proceed with upload
```

## Error Codes

| Code | Description | Status | Retryable |
|------|-------------|--------|-----------|
| `FILE_TOO_LARGE` | File > 5MB | 400 | No |
| `INVALID_FILE_TYPE` | Invalid format | 400 | No |
| `UPLOAD_FAILED` | Upload failed | 500 | Yes |
| `GENERATION_FAILED` | AI failed | 500 | No |
| `API_ERROR` | API error | 500 | Yes |
| `RATE_LIMIT` | Rate limited | 429 | Yes |
| `NETWORK_ERROR` | Network issue | 503 | Yes |
| `TEMPLATE_NOT_FOUND` | Not found | 404 | No |
| `VALIDATION_ERROR` | Invalid input | 400 | No |
| `UNKNOWN_ERROR` | Unknown | 500 | Yes |

## Common Error Scenarios

### File Upload Error
```typescript
// Client-side validation
const validation = validateImageFile(file);
if (!validation.isValid) {
  return validation.error; // FILE_TOO_LARGE or INVALID_FILE_TYPE
}
```

### API Request Error
```typescript
try {
  const response = await fetch('/api/endpoint');
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error.message);
  }
} catch (error) {
  // Handle error
  console.error(error);
}
```

### React Component Error
```tsx
// Wrap component with error boundary
<ErrorBoundary fallback={<CustomErrorUI />}>
  <ComponentThatMightFail />
</ErrorBoundary>
```

## Testing

### Run Test Suite
```bash
npm run dev  # Start server
node test-error-handling.mjs  # Run tests
```

### Manual Test Checklist
- [ ] Upload file > 5MB
- [ ] Upload non-image file
- [ ] Submit empty form
- [ ] Access invalid URL
- [ ] Disconnect internet
- [ ] Trigger React error

## Key Files

| File | Purpose |
|------|---------|
| `components/error-boundary.tsx` | Error Boundary component |
| `components/error-display.tsx` | Error display UI |
| `lib/validation.ts` | Validation functions |
| `lib/gemini.ts` | API error handling |
| `app/error.tsx` | Error page |
| `test-error-handling.mjs` | Test suite |

## Best Practices

1. ✅ Always validate on both client and server
2. ✅ Use consistent error format
3. ✅ Provide user-friendly messages
4. ✅ Log errors in development
5. ✅ Make errors actionable (retry button)
6. ✅ Handle edge cases (network, rate limits)
7. ✅ Use Error Boundaries for React errors

## Need Help?

See `ERROR_HANDLING_GUIDE.md` for comprehensive documentation.
