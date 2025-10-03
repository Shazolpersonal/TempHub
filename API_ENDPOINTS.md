# Template API Endpoints Documentation

## Overview
This document describes the template management API endpoints implemented for the TempHub platform.

## Base URL
- Local Development: `http://localhost:3000/api`
- Production: `https://your-app.netlify.app/api`

## Endpoints

### 1. GET /api/templates
Fetch all templates with optional category filtering.

**Query Parameters:**
- `category` (optional): Filter templates by category (e.g., "product", "magazine", "character")

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "template-1",
        "name": "TIME Magazine Cover",
        "category": "magazine",
        "prompt": "Create a professional TIME Magazine cover...",
        "previewImage": "/template-previews/time-magazine.jpg",
        "createdAt": "2025-01-15T10:00:00Z",
        "updatedAt": "2025-01-15T10:00:00Z"
      }
    ],
    "total": 1
  }
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": {
    "code": "API_ERROR",
    "message": "Failed to fetch templates",
    "retryable": true,
    "details": "Error details"
  }
}
```

**Requirements Satisfied:**
- 5.2: Admin can view all templates
- 5.4: Display all existing templates

---

### 2. POST /api/templates
Create a new template.

**Request Body:**
```json
{
  "name": "Template Name",
  "category": "product",
  "prompt": "Detailed prompt for AI generation...",
  "previewImage": "/template-previews/example.jpg"
}
```

**Validation Rules:**
- `name`: Required, 3-100 characters
- `category`: Required, non-empty string
- `prompt`: Required, 10-5000 characters
- `previewImage`: Required, non-empty string

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "template": {
      "id": "template-1759481247551-lr5n92n0n",
      "name": "Template Name",
      "category": "product",
      "prompt": "Detailed prompt for AI generation...",
      "previewImage": "/template-previews/example.jpg",
      "createdAt": "2025-10-03T08:47:27.551Z",
      "updatedAt": "2025-10-03T08:47:27.551Z"
    },
    "message": "Template created successfully"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Template name is required. Category is required...",
    "retryable": false,
    "details": {
      "errors": [
        "Template name is required.",
        "Category is required."
      ]
    }
  }
}
```

**Requirements Satisfied:**
- 5.2: Admin creates new template with required fields
- 5.3: Store template and make it available immediately

---

### 3. GET /api/templates/[id]
Fetch a single template by ID.

**URL Parameters:**
- `id`: Template ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "template": {
      "id": "template-1",
      "name": "TIME Magazine Cover",
      "category": "magazine",
      "prompt": "Create a professional TIME Magazine cover...",
      "previewImage": "/template-previews/time-magazine.jpg",
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z"
    }
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": {
    "code": "TEMPLATE_NOT_FOUND",
    "message": "Template not found",
    "retryable": false
  }
}
```

**Requirements Satisfied:**
- 5.4: Fetch specific template for viewing/editing

---

### 4. PUT /api/templates/[id]
Update an existing template.

**URL Parameters:**
- `id`: Template ID

**Request Body:**
```json
{
  "name": "Updated Template Name",
  "category": "product",
  "prompt": "Updated prompt...",
  "previewImage": "/template-previews/updated.jpg"
}
```

**Validation Rules:**
Same as POST /api/templates

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "template": {
      "id": "template-1",
      "name": "Updated Template Name",
      "category": "product",
      "prompt": "Updated prompt...",
      "previewImage": "/template-previews/updated.jpg",
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-10-03T08:47:27.589Z"
    },
    "message": "Template updated successfully"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": {
    "code": "TEMPLATE_NOT_FOUND",
    "message": "Template not found",
    "retryable": false
  }
}
```

**Error Response (400 Bad Request):**
Same validation error format as POST

**Requirements Satisfied:**
- 5.5: Admin can edit template (name, category, prompt, preview image)

---

### 5. DELETE /api/templates/[id]
Delete a template.

**URL Parameters:**
- `id`: Template ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Template deleted successfully"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": {
    "code": "TEMPLATE_NOT_FOUND",
    "message": "Template not found",
    "retryable": false
  }
}
```

**Requirements Satisfied:**
- 5.6: Admin can delete template from database

---

### 6. POST /api/upload
Handle user image upload with validation.

**Request:**
- Content-Type: `multipart/form-data`
- Form field: `image` (File)

**Validation Rules:**
- Maximum file size: 5MB
- Supported formats: JPG, JPEG, PNG, WEBP, GIF, HEIC, HEIF

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "imageUrl": "data:image/png;base64,iVBORw0KGgo...",
    "imageData": "iVBORw0KGgo..."
  }
}
```

**Error Response (400 Bad Request - File Too Large):**
```json
{
  "success": false,
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File size exceeds the maximum limit of 5MB. Your file is 6 MB.",
    "retryable": false,
    "details": {
      "fileSize": 6291456,
      "maxSize": 5242880
    }
  }
}
```

**Error Response (400 Bad Request - Invalid File Type):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Invalid file type. Please upload a valid image file (JPG, PNG, WEBP, GIF, HEIC).",
    "retryable": false,
    "details": {
      "fileType": "text/plain",
      "fileName": "test.txt",
      "supportedTypes": ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif"]
    }
  }
}
```

**Error Response (400 Bad Request - No File):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "No image file provided.",
    "retryable": false
  }
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "error": {
    "code": "UPLOAD_FAILED",
    "message": "Failed to upload image. Please try again.",
    "retryable": true,
    "details": "Error details"
  }
}
```

**Requirements Satisfied:**
- 2.2: Validate file size is 5MB or less
- 2.3: Display error if file exceeds 5MB
- 2.4: Accept all supported image formats (JPG, PNG, WEBP, etc.)
- 2.5: Display preview and enable Generate button after successful upload

---

### 7. POST /api/generate
Generate an AI image using a template and user-uploaded image.

**Request Body:**
```json
{
  "templateId": "template-1",
  "imageData": "data:image/png;base64,iVBORw0KGgo..."
}
```

**Validation Rules:**
- `templateId`: Required, must be a valid template ID
- `imageData`: Required, base64 encoded image data (with or without data URI prefix)

**Response (200 OK):**
```json
{
  "success": true,
  "generatedImage": "Generated content or base64 image data...",
  "mimeType": "text/plain"
}
```

**Error Response (400 Bad Request - Missing Fields):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Template ID and image data are required",
    "retryable": false
  }
}
```

**Error Response (404 Not Found - Template Not Found):**
```json
{
  "success": false,
  "error": {
    "code": "TEMPLATE_NOT_FOUND",
    "message": "Template not found",
    "retryable": false
  }
}
```

**Error Response (429 Too Many Requests - Rate Limit):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT",
    "message": "API rate limit exceeded. Please try again in a few minutes.",
    "retryable": true,
    "details": "Rate limit error details"
  }
}
```

**Error Response (502 Bad Gateway - API Error):**
```json
{
  "success": false,
  "error": {
    "code": "API_ERROR",
    "message": "Gemini API key is not configured",
    "retryable": false
  }
}
```

**Error Response (503 Service Unavailable - Network Error):**
```json
{
  "success": false,
  "error": {
    "code": "NETWORK_ERROR",
    "message": "Network connection issue. Please check your internet connection and try again.",
    "retryable": true,
    "details": "Network error details"
  }
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "error": {
    "code": "GENERATION_FAILED",
    "message": "An unexpected error occurred during image generation",
    "retryable": true,
    "details": "Error details"
  }
}
```

**Retry Logic:**
- Automatic retry for transient errors (network issues, rate limits, server errors)
- Maximum 3 retry attempts with exponential backoff
- Base delay: 1 second, multiplier: 2x (1s, 2s, 4s)
- Non-retryable errors (validation, template not found, API key issues) fail immediately

**Requirements Satisfied:**
- 3.1: Send uploaded image and template prompt to Gemini API
- 3.3: Display generated image when API responds successfully
- 3.6: Display error message and provide retry option on API failure
- 3.7: Display appropriate error message on network issues
- 7.2: Handle API rate limit errors
- 7.3: Handle Gemini API errors with retry functionality

---

## Error Codes

| Code | Description | Retryable |
|------|-------------|-----------|
| `VALIDATION_ERROR` | Input validation failed | No |
| `TEMPLATE_NOT_FOUND` | Template ID not found | No |
| `FILE_TOO_LARGE` | File exceeds 5MB limit | No |
| `INVALID_FILE_TYPE` | Unsupported file format | No |
| `UPLOAD_FAILED` | Upload processing failed | Yes |
| `GENERATION_FAILED` | Image generation failed | Yes |
| `API_ERROR` | Server/API error occurred | Varies |
| `RATE_LIMIT` | API rate limit exceeded | Yes |
| `NETWORK_ERROR` | Network connection issue | Yes |

## Testing

Run the test suites with:
```bash
npm run dev  # Start dev server in one terminal
node test-api.mjs  # Test template endpoints
node test-upload-api.mjs  # Test upload endpoint
node test-generate-api.mjs  # Test image generation endpoint
```

## Implementation Notes

1. **Validation**: All endpoints validate input data using `lib/validation.ts`
2. **Error Handling**: Consistent error format across all endpoints
3. **Data Storage**: Templates stored in `data/templates.json`
4. **Auto-generated Fields**: `id`, `createdAt`, `updatedAt` are automatically managed
5. **Category Filtering**: GET /api/templates supports optional category query parameter

## Requirements Coverage

### Template Management (Task 7)
✅ **Requirement 5.2**: Create new template with required fields (name, category, prompt, preview image)
✅ **Requirement 5.3**: Store template and make it immediately available
✅ **Requirement 5.4**: Display all existing templates with edit and delete options
✅ **Requirement 5.5**: Edit template (modify name, category, prompt, preview image)
✅ **Requirement 5.6**: Delete template from database and public gallery

### Image Upload (Task 8)
✅ **Requirement 2.2**: Validate file size is 5MB or less
✅ **Requirement 2.3**: Display error if file exceeds 5MB
✅ **Requirement 2.4**: Accept all supported image formats
✅ **Requirement 2.5**: Return temporary image data for generation

### Image Generation (Task 9)
✅ **Requirement 3.1**: Send uploaded image and template prompt to Gemini API
✅ **Requirement 3.3**: Display generated image when API responds successfully
✅ **Requirement 3.6**: Display error message and provide retry option on API failure
✅ **Requirement 3.7**: Display appropriate error message on network issues
✅ **Requirement 7.2**: Handle API rate limit errors
✅ **Requirement 7.3**: Handle Gemini API errors with retry functionality

All requirements for Tasks 7, 8, and 9 have been successfully implemented and tested.
