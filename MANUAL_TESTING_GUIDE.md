# Manual Testing Guide - AI Image Template Platform

## Introduction

This guide provides step-by-step instructions for manually testing all features of the AI Image Template Platform. Follow each section to ensure the application works correctly.

---

## Prerequisites

Before testing, ensure:
1. ✅ Development server is running (`npm run dev`)
2. ✅ Application is accessible at `http://localhost:3000`
3. ✅ You have test images ready (various sizes and formats)
4. ✅ Internet connection is active

---

## Test 1: Homepage and Template Gallery

### Steps:
1. Open your browser and navigate to `http://localhost:3000`
2. Observe the homepage

### What to Check:
- [ ] Page loads without errors
- [ ] Template gallery is visible
- [ ] Multiple template cards are displayed
- [ ] Each template card shows:
  - Preview image
  - Template name
  - Category badge
- [ ] Category filter tabs are visible at the top
- [ ] "All" category is selected by default

### Expected Result:
✅ Homepage displays a clean gallery of template cards with category filters

---

## Test 2: Category Filtering

### Steps:
1. On the homepage, click on the "Magazine" category tab
2. Observe the templates displayed
3. Click on the "Product" category tab
4. Observe the templates displayed
5. Click on the "Character" category tab
6. Observe the templates displayed
7. Click on the "All" category tab
8. Observe the templates displayed

### What to Check:
- [ ] Clicking "Magazine" shows only magazine templates
- [ ] Clicking "Product" shows only product templates
- [ ] Clicking "Character" shows only character templates
- [ ] Clicking "All" shows all templates
- [ ] Active category tab is highlighted
- [ ] Template count updates for each category
- [ ] Filtering is instant (no page reload)

### Expected Result:
✅ Category filters work correctly and show only relevant templates

---

## Test 3: Template Selection

### Steps:
1. On the homepage, click on any template card
2. Observe the template detail page

### What to Check:
- [ ] Page navigates to template detail page
- [ ] URL changes to `/template/[id]`
- [ ] Template name is displayed
- [ ] Template category is shown
- [ ] Template preview image is visible
- [ ] Image upload area is visible
- [ ] "Generate" button is visible but disabled

### Expected Result:
✅ Template detail page loads with all information and upload interface

---

## Test 4: Image Upload - Drag and Drop

### Steps:
1. On a template detail page, prepare a valid image file (JPEG, PNG, or WEBP)
2. Drag the image file over the upload area
3. Observe the visual feedback
4. Drop the image file
5. Observe the result

### What to Check:
- [ ] Upload area highlights when dragging over it
- [ ] Cursor changes to indicate drop is allowed
- [ ] After dropping, image preview appears
- [ ] File name is displayed
- [ ] File size is shown
- [ ] "Generate" button becomes enabled
- [ ] No error messages appear

### Expected Result:
✅ Drag-and-drop upload works smoothly with visual feedback

---

## Test 5: Image Upload - Click to Upload

### Steps:
1. On a template detail page, click on the upload area
2. File picker dialog should open
3. Select a valid image file
4. Click "Open" or "Choose"
5. Observe the result

### What to Check:
- [ ] Clicking upload area opens file picker
- [ ] Can browse and select image file
- [ ] After selection, image preview appears
- [ ] File name is displayed
- [ ] File size is shown
- [ ] "Generate" button becomes enabled
- [ ] No error messages appear

### Expected Result:
✅ Click-to-upload works and shows image preview

---

## Test 6: File Size Validation

### Steps:
1. Prepare an image file larger than 5MB
2. Try to upload it using either drag-and-drop or click-to-upload
3. Observe the result

### What to Check:
- [ ] Error message appears
- [ ] Error message says: "Image file is too large. Maximum size is 5MB."
- [ ] Image preview does NOT appear
- [ ] "Generate" button remains disabled
- [ ] Error message is clearly visible (red color)

### Expected Result:
✅ Files over 5MB are rejected with clear error message

---

## Test 7: File Type Validation

### Steps:
1. Prepare a non-image file (e.g., .txt, .pdf, .docx)
2. Try to upload it using either drag-and-drop or click-to-upload
3. Observe the result

### What to Check:
- [ ] Error message appears
- [ ] Error message says: "Invalid file type. Please upload a valid image."
- [ ] File preview does NOT appear
- [ ] "Generate" button remains disabled
- [ ] Error message is clearly visible (red color)

### Expected Result:
✅ Non-image files are rejected with clear error message

---

## Test 8: Image Generation

### Steps:
1. Upload a valid image (under 5MB, JPEG/PNG/WEBP)
2. Wait for preview to appear
3. Click the "Generate" button
4. Observe the generation process

### What to Check:
- [ ] Loading spinner appears immediately
- [ ] Progress message is displayed (e.g., "Generating your image...")
- [ ] "Generate" button is disabled during generation
- [ ] Page does not freeze or become unresponsive
- [ ] After completion (may take 10-30 seconds):
  - [ ] Generated image appears
  - [ ] Loading spinner disappears
  - [ ] Download button appears
  - [ ] Success message may appear

### Expected Result:
✅ Image generation works with clear loading state and displays result

---

## Test 9: Download Generated Image

### Steps:
1. After successfully generating an image, locate the download button
2. Click the download button
3. Check your downloads folder

### What to Check:
- [ ] Download button is clearly visible
- [ ] Clicking download initiates file download
- [ ] File is saved to downloads folder
- [ ] File name is descriptive (e.g., "generated-image-[timestamp].png")
- [ ] Downloaded file is a valid image
- [ ] Image opens correctly in image viewer
- [ ] Image quality is good

### Expected Result:
✅ Generated image downloads successfully and is viewable

---

## Test 10: Multiple Template Testing

### Steps:
1. Test image generation with "TIME Magazine Cover" template
2. Test image generation with "Influencer Product Shot" template
3. Test image generation with "Superhero Character" template
4. Compare the results

### What to Check:
- [ ] Each template produces different style results
- [ ] Generated images match the template description
- [ ] All templates work without errors
- [ ] Generation time is reasonable (10-30 seconds)

### Expected Result:
✅ Different templates produce different styled images

---

## Test 11: Admin Dashboard Access

### Steps:
1. Navigate to `http://localhost:3000/admin`
2. Observe the admin dashboard

### What to Check:
- [ ] Admin dashboard loads without errors
- [ ] "Create New Template" button is visible
- [ ] List of existing templates is displayed
- [ ] Each template in list shows:
  - Template name
  - Category
  - Preview image (thumbnail)
  - Edit button
  - Delete button
- [ ] Template count is displayed

### Expected Result:
✅ Admin dashboard displays with template management interface

---

## Test 12: Create New Template

### Steps:
1. On admin dashboard, click "Create New Template"
2. Fill in the form:
   - **Name:** "Test Template [Your Name]"
   - **Category:** Select "Character"
   - **Prompt:** "Create a professional portrait of the person in the uploaded image with dramatic lighting and artistic background."
   - **Preview Image:** Upload a sample image
3. Click "Save Template"
4. Observe the result

### What to Check:
- [ ] Form has all required fields
- [ ] Category dropdown works
- [ ] Prompt textarea allows multi-line text
- [ ] Preview image upload works
- [ ] "Save Template" button is enabled when all fields are filled
- [ ] After saving:
  - [ ] Success message appears
  - [ ] Redirects to admin dashboard
  - [ ] New template appears in list
- [ ] Navigate to homepage and verify new template is visible

### Expected Result:
✅ New template is created and appears in both admin and public gallery

---

## Test 13: Edit Existing Template

### Steps:
1. On admin dashboard, find the template you just created
2. Click the "Edit" button
3. Modify the template:
   - Change name to "Updated Test Template [Your Name]"
   - Change category to "Product"
   - Update the prompt
4. Click "Save Template"
5. Observe the result

### What to Check:
- [ ] Edit page loads with existing template data pre-filled
- [ ] All fields are editable
- [ ] After saving:
  - [ ] Success message appears
  - [ ] Redirects to admin dashboard
  - [ ] Updated template shows new information
- [ ] Navigate to homepage and verify changes are visible

### Expected Result:
✅ Template is updated successfully with new information

---

## Test 14: Delete Template

### Steps:
1. On admin dashboard, find the template you created
2. Click the "Delete" button
3. Observe the confirmation dialog
4. Click "Confirm" or "Delete"
5. Observe the result

### What to Check:
- [ ] Confirmation dialog appears
- [ ] Dialog asks "Are you sure you want to delete this template?"
- [ ] Dialog has "Cancel" and "Delete" buttons
- [ ] After confirming:
  - [ ] Success message appears
  - [ ] Template is removed from list
  - [ ] Template count updates
- [ ] Navigate to homepage and verify template is gone

### Expected Result:
✅ Template is deleted with confirmation and removed from all views

---

## Test 15: Form Validation

### Steps:
1. On admin dashboard, click "Create New Template"
2. Try to save without filling any fields
3. Fill in only the name field
4. Try to save
5. Fill in name and category
6. Try to save
7. Fill in all fields except preview image
8. Try to save

### What to Check:
- [ ] Cannot save with empty form
- [ ] Validation errors appear for missing fields
- [ ] Error messages are clear and specific
- [ ] Form highlights which fields are required
- [ ] Can only save when all required fields are filled

### Expected Result:
✅ Form validation prevents incomplete template creation

---

## Test 16: Error Handling - Network Disconnect

### Steps:
1. On a template detail page, upload an image
2. Disconnect from the internet (turn off WiFi or unplug ethernet)
3. Click "Generate" button
4. Observe the error handling

### What to Check:
- [ ] Error message appears
- [ ] Error message mentions network issue
- [ ] "Try Again" or "Retry" button appears
- [ ] Reconnect to internet
- [ ] Click "Try Again"
- [ ] Generation works after reconnecting

### Expected Result:
✅ Network errors are detected and user can retry

---

## Test 17: Error Handling - Server Down

### Steps:
1. Stop the development server (Ctrl+C in terminal)
2. Try to browse templates on homepage
3. Observe the error handling
4. Restart the server (`npm run dev`)
5. Refresh the page

### What to Check:
- [ ] Error message appears when server is down
- [ ] Error message is user-friendly
- [ ] Page doesn't crash or show technical errors
- [ ] After restarting server, page works normally

### Expected Result:
✅ Server errors are handled gracefully

---

## Test 18: Responsive Design - Mobile

### Steps:
1. Open browser developer tools (F12)
2. Toggle device toolbar (Ctrl+Shift+M or Cmd+Shift+M)
3. Select "iPhone 12 Pro" or similar mobile device
4. Test all features on mobile view

### What to Check:
- [ ] Homepage layout adapts to mobile screen
- [ ] Template cards stack vertically
- [ ] Category filters are accessible
- [ ] Template detail page is usable
- [ ] Image upload works on mobile
- [ ] Generate button is accessible
- [ ] Admin dashboard is usable on mobile
- [ ] Forms are easy to fill on mobile
- [ ] No horizontal scrolling
- [ ] Text is readable without zooming

### Expected Result:
✅ All features work well on mobile devices

---

## Test 19: Responsive Design - Tablet

### Steps:
1. In device toolbar, select "iPad" or similar tablet device
2. Test in both portrait and landscape orientations
3. Test all features

### What to Check:
- [ ] Layout adapts to tablet screen size
- [ ] Template gallery shows appropriate number of columns
- [ ] All features are accessible
- [ ] Touch interactions work smoothly
- [ ] Forms are easy to use

### Expected Result:
✅ All features work well on tablet devices

---

## Test 20: Browser Compatibility

### Steps:
1. Test the application in different browsers:
   - Chrome/Edge
   - Firefox
   - Safari (if on Mac)
2. Test all major features in each browser

### What to Check:
- [ ] Application loads in all browsers
- [ ] All features work consistently
- [ ] No browser-specific errors
- [ ] UI looks consistent across browsers
- [ ] Performance is acceptable in all browsers

### Expected Result:
✅ Application works consistently across major browsers

---

## Test Results Checklist

After completing all tests, verify:

### Public User Features
- [ ] Template browsing works
- [ ] Category filtering works
- [ ] Template selection works
- [ ] Image upload (drag-and-drop) works
- [ ] Image upload (click-to-upload) works
- [ ] File size validation works
- [ ] File type validation works
- [ ] Image generation works
- [ ] Download functionality works
- [ ] Error handling works

### Admin Features
- [ ] Admin dashboard access works
- [ ] Create template works
- [ ] Edit template works
- [ ] Delete template works
- [ ] Form validation works

### Responsive Design
- [ ] Desktop view works
- [ ] Tablet view works
- [ ] Mobile view works

### Error Handling
- [ ] Network errors handled
- [ ] Server errors handled
- [ ] Validation errors handled

---

## Reporting Issues

If you find any issues during testing:

1. **Document the issue:**
   - What were you trying to do?
   - What did you expect to happen?
   - What actually happened?
   - Can you reproduce it?

2. **Include details:**
   - Browser and version
   - Device type (desktop/tablet/mobile)
   - Screen size
   - Steps to reproduce
   - Screenshots if possible

3. **Severity:**
   - Critical: Feature doesn't work at all
   - High: Feature works but has major issues
   - Medium: Feature works but has minor issues
   - Low: Cosmetic or minor usability issues

---

## Conclusion

After completing all tests:
- ✅ All features should work as expected
- ✅ Error handling should be robust
- ✅ Responsive design should work on all devices
- ✅ User experience should be smooth and intuitive

If all tests pass, the application is ready for production deployment! 🎉
