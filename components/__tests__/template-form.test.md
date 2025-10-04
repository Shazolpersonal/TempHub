# Template Form Component Test Documentation

## Component Overview
The TemplateForm component provides a form interface for creating and editing templates in the admin panel.

## Test Scenarios

### 1. Create Mode - Empty Form
```tsx
<TemplateForm
  categories={[
    { id: 'cat-1', name: 'Magazine', slug: 'magazine' },
    { id: 'cat-2', name: 'Product', slug: 'product' }
  ]}
  onSubmit={async (data) => console.log('Submit:', data)}
  onCancel={() => console.log('Cancel clicked')}
/>
```
**Expected**: 
- Shows "Create New Template" title
- All fields are empty
- Submit button shows "Create Template"
- All required fields marked with red asterisk

### 2. Edit Mode - Pre-filled Form
```tsx
<TemplateForm
  template={{
    id: '1',
    name: 'TIME Magazine Cover',
    category: 'magazine',
    prompt: 'Create a professional TIME Magazine cover...',
    previewImage: '/template-previews/time-magazine.jpg',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z'
  }}
  categories={[
    { id: 'cat-1', name: 'Magazine', slug: 'magazine' },
    { id: 'cat-2', name: 'Product', slug: 'product' }
  ]}
  onSubmit={async (data) => console.log('Update:', data)}
  onCancel={() => console.log('Cancel clicked')}
/>
```
**Expected**:
- Shows "Edit Template" title
- All fields pre-filled with template data
- Submit button shows "Update Template"
- Preview image displayed

### 3. Validation - Empty Name
**Action**: Submit form with empty name field
**Expected**: 
- Error message: "Template name is required"
- Name input has red border
- Form not submitted

### 4. Validation - Short Name
**Action**: Submit form with name "AB" (less than 3 characters)
**Expected**:
- Error message: "Template name must be at least 3 characters"
- Name input has red border
- Form not submitted

### 5. Validation - No Category Selected
**Action**: Submit form without selecting a category
**Expected**:
- Error message: "Category is required"
- Category select has red border
- Form not submitted

### 6. Validation - Empty Prompt
**Action**: Submit form with empty prompt field
**Expected**:
- Error message: "Prompt is required"
- Prompt textarea has red border
- Form not submitted

### 7. Validation - Short Prompt
**Action**: Submit form with prompt less than 20 characters
**Expected**:
- Error message: "Prompt must be at least 20 characters"
- Prompt textarea has red border
- Form not submitted

### 8. Validation - No Preview Image
**Action**: Submit form without uploading preview image (create mode)
**Expected**:
- Error message: "Preview image is required"
- Image input has red border
- Form not submitted

### 9. Image Upload - Invalid File Type
**Action**: Upload a PDF or non-image file
**Expected**:
- Error message: "Invalid file type. Please upload JPG, PNG, or WEBP"
- File not accepted
- No preview shown

### 10. Image Upload - File Too Large
**Action**: Upload an image larger than 5MB
**Expected**:
- Error message: "File size must be less than 5MB"
- File not accepted
- No preview shown

### 11. Image Upload - Valid File
**Action**: Upload a valid JPG/PNG/WEBP file under 5MB
**Expected**:
- Preview image displayed below input
- No error message
- Form data updated with base64 image

### 12. Successful Form Submission
**Action**: Fill all fields correctly and submit
**Expected**:
- Submit button shows "Saving..."
- Submit button disabled during submission
- onSubmit callback called with form data
- No validation errors

### 13. Cancel Button
**Action**: Click cancel button
**Expected**:
- onCancel callback called
- Form not submitted
- No validation performed

### 14. Submitting State
**Action**: Submit form (async operation in progress)
**Expected**:
- Submit button shows "Saving..."
- Submit button disabled
- Cancel button disabled
- User cannot interact with form

## Requirements Coverage

### Requirement 5.2: Create Template
- ✅ Form fields for name, category, prompt, preview image
- ✅ Create mode with empty fields
- ✅ Submit handler for creating new template

### Requirement 5.3: Template Data Input
- ✅ Name input field
- ✅ Category dropdown with all categories
- ✅ Prompt textarea for detailed instructions
- ✅ Preview image upload

### Requirement 5.5: Edit Template
- ✅ Edit mode with pre-filled data
- ✅ Update existing template fields
- ✅ Submit handler for updating template

### Requirement 10.1: Prompt Text Area
- ✅ Multi-line textarea for prompt
- ✅ Minimum 20 characters validation
- ✅ Helper text explaining prompt purpose

### Requirement 10.3: Detailed Instructions
- ✅ Large textarea (8 rows) for detailed prompts
- ✅ Placeholder text guiding prompt creation
- ✅ Character count validation

## Form Fields

### Name Field
- Type: Text input
- Required: Yes
- Validation: Min 3 characters
- Placeholder: "e.g., TIME Magazine Cover"

### Category Field
- Type: Select dropdown
- Required: Yes
- Options: Loaded from categories prop
- Displays category name, stores slug value

### Prompt Field
- Type: Textarea
- Required: Yes
- Validation: Min 20 characters
- Rows: 8
- Placeholder: Detailed instructions text
- Helper text: Explains prompt purpose

### Preview Image Field
- Type: File input
- Required: Yes (create mode), Optional (edit mode)
- Accepted formats: JPG, PNG, WEBP
- Max size: 5MB
- Shows preview after upload

## Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| template | Template | No | Existing template for edit mode |
| categories | Category[] | Yes | Available categories for dropdown |
| onSubmit | (data: TemplateFormData) => Promise<void> | Yes | Async callback for form submission |
| onCancel | () => void | Yes | Callback for cancel button |

## Form Data Structure

```typescript
interface TemplateFormData {
  name: string;
  category: string;
  prompt: string;
  previewImage: string; // base64 or URL
}
```

## Validation Rules

1. **Name**: Required, min 3 characters
2. **Category**: Required, must be valid category slug
3. **Prompt**: Required, min 20 characters
4. **Preview Image**: Required (create), optional (edit)
5. **Image Type**: JPG, PNG, WEBP only
6. **Image Size**: Max 5MB

## Error Display

- Errors shown below each field
- Red text color for error messages
- Red border on invalid fields
- Errors cleared when field is corrected
- All errors shown on submit attempt

## Styling Features

- Uses shadcn/ui Card component for container
- Responsive layout with max-width
- Proper spacing between fields
- Label with required indicator (red asterisk)
- Helper text in muted color
- Image preview with fixed dimensions
- Disabled state styling during submission

## Integration Example

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TemplateForm } from '@/components/admin/template-form';
import { Category, TemplateFormData } from '@/types';

export default function CreateTemplatePage({ 
  categories 
}: { 
  categories: Category[] 
}) {
  const router = useRouter();

  const handleSubmit = async (data: TemplateFormData) => {
    const response = await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      router.push('/admin');
    } else {
      throw new Error('Failed to create template');
    }
  };

  const handleCancel = () => {
    router.push('/admin');
  };

  return (
    <TemplateForm
      categories={categories}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
```

## Accessibility

- Proper label associations with htmlFor
- Required fields marked visually and semantically
- Error messages linked to inputs
- Keyboard navigation support
- Focus management
- Disabled state properly communicated

## Future Enhancements

- Rich text editor for prompt field
- Image cropping/editing before upload
- Drag-and-drop image upload
- Multiple preview images
- Template preview generation
- Auto-save draft functionality
