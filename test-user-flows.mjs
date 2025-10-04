/**
 * Integration Tests for Complete User Flows
 * Tests all user-facing functionality end-to-end
 */

import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';
const TEST_RESULTS = [];

// Helper function to log test results
function logTest(testName, passed, details = '') {
  const result = { testName, passed, details, timestamp: new Date().toISOString() };
  TEST_RESULTS.push(result);
  console.log(`${passed ? '✅' : '❌'} ${testName}`);
  if (details) console.log(`   ${details}`);
}

// Helper function to create test image data
function createTestImageData(size = 'small') {
  // Create a minimal valid JPEG base64 string
  const sizes = {
    small: 1024, // 1KB
    medium: 1024 * 500, // 500KB
    large: 1024 * 1024 * 3, // 3MB
    oversized: 1024 * 1024 * 6 // 6MB (over limit)
  };
  
  // Minimal JPEG header + data
  const jpegHeader = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA//2Q==';
  
  // Pad to approximate size
  const targetSize = sizes[size] || sizes.small;
  const padding = 'A'.repeat(Math.max(0, targetSize - jpegHeader.length));
  
  return `data:image/jpeg;base64,${jpegHeader}${padding}`;
}

// Test 1: Template Browsing and Filtering
async function testTemplateBrowsing() {
  console.log('\n📋 Testing Template Browsing and Filtering...\n');
  
  try {
    // Test 1.1: Fetch all templates
    const allTemplatesRes = await fetch(`${BASE_URL}/api/templates`);
    const allTemplatesData = await allTemplatesRes.json();
    
    if (allTemplatesRes.ok && allTemplatesData.templates && allTemplatesData.templates.length > 0) {
      logTest('Fetch all templates', true, `Found ${allTemplatesData.templates.length} templates`);
    } else {
      logTest('Fetch all templates', false, 'No templates returned');
      return;
    }
    
    // Test 1.2: Filter by category
    const categories = ['magazine', 'product', 'character'];
    for (const category of categories) {
      const categoryRes = await fetch(`${BASE_URL}/api/templates?category=${category}`);
      const categoryData = await categoryRes.json();
      
      if (categoryRes.ok) {
        const allMatchCategory = categoryData.templates.every(t => t.category === category);
        logTest(`Filter templates by category: ${category}`, allMatchCategory, 
          `Found ${categoryData.templates.length} templates`);
      } else {
        logTest(`Filter templates by category: ${category}`, false, 'Request failed');
      }
    }
    
    // Test 1.3: Fetch single template
    const templateId = allTemplatesData.templates[0].id;
    const singleTemplateRes = await fetch(`${BASE_URL}/api/templates/${templateId}`);
    const singleTemplateData = await singleTemplateRes.json();
    
    if (singleTemplateRes.ok && singleTemplateData.template) {
      logTest('Fetch single template by ID', true, `Template: ${singleTemplateData.template.name}`);
    } else {
      logTest('Fetch single template by ID', false, 'Template not found');
    }
    
    // Test 1.4: Test invalid template ID
    const invalidRes = await fetch(`${BASE_URL}/api/templates/invalid-id-12345`);
    logTest('Handle invalid template ID', invalidRes.status === 404, 
      `Status: ${invalidRes.status}`);
    
  } catch (error) {
    logTest('Template browsing tests', false, error.message);
  }
}

// Test 2: Image Upload with Various File Sizes and Types
async function testImageUpload() {
  console.log('\n📤 Testing Image Upload...\n');
  
  try {
    // Test 2.1: Upload small valid image
    const smallImageData = createTestImageData('small');
    const smallImageBlob = await fetch(smallImageData).then(r => r.blob());
    const smallFormData = new FormData();
    smallFormData.append('image', smallImageBlob, 'test-small.jpg');
    
    const smallUploadRes = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: smallFormData
    });
    const smallUploadData = await smallUploadRes.json();
    
    if (smallUploadRes.ok && smallUploadData.imageData) {
      logTest('Upload small valid image (< 1MB)', true, 'Image uploaded successfully');
    } else {
      logTest('Upload small valid image (< 1MB)', false, smallUploadData.error || 'Upload failed');
    }
    
    // Test 2.2: Upload medium-sized image
    const mediumImageData = createTestImageData('medium');
    const mediumImageBlob = await fetch(mediumImageData).then(r => r.blob());
    const mediumFormData = new FormData();
    mediumFormData.append('image', mediumImageBlob, 'test-medium.jpg');
    
    const mediumUploadRes = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: mediumFormData
    });
    
    logTest('Upload medium image (~500KB)', mediumUploadRes.ok, 
      `Status: ${mediumUploadRes.status}`);
    
    // Test 2.3: Upload large but valid image
    const largeImageData = createTestImageData('large');
    const largeImageBlob = await fetch(largeImageData).then(r => r.blob());
    const largeFormData = new FormData();
    largeFormData.append('image', largeImageBlob, 'test-large.jpg');
    
    const largeUploadRes = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: largeFormData
    });
    
    logTest('Upload large image (~3MB, under 5MB limit)', largeUploadRes.ok, 
      `Status: ${largeUploadRes.status}`);
    
    // Test 2.4: Upload oversized image (should fail)
    const oversizedImageData = createTestImageData('oversized');
    const oversizedImageBlob = await fetch(oversizedImageData).then(r => r.blob());
    const oversizedFormData = new FormData();
    oversizedFormData.append('image', oversizedImageBlob, 'test-oversized.jpg');
    
    const oversizedUploadRes = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: oversizedFormData
    });
    
    logTest('Reject oversized image (> 5MB)', !oversizedUploadRes.ok, 
      `Status: ${oversizedUploadRes.status}`);
    
    // Test 2.5: Upload without image
    const emptyFormData = new FormData();
    const emptyUploadRes = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: emptyFormData
    });
    
    logTest('Reject upload without image', !emptyUploadRes.ok, 
      `Status: ${emptyUploadRes.status}`);
    
  } catch (error) {
    logTest('Image upload tests', false, error.message);
  }
}

// Test 3: Image Generation with Sample Templates
async function testImageGeneration() {
  console.log('\n🎨 Testing Image Generation...\n');
  
  try {
    // Get a template to use for generation
    const templatesRes = await fetch(`${BASE_URL}/api/templates`);
    const templatesData = await templatesRes.json();
    
    if (!templatesData.templates || templatesData.templates.length === 0) {
      logTest('Image generation tests', false, 'No templates available');
      return;
    }
    
    const testTemplate = templatesData.templates[0];
    const testImageData = createTestImageData('small');
    
    // Test 3.1: Generate image with valid template and image
    const generateRes = await fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: testTemplate.id,
        imageData: testImageData
      })
    });
    
    const generateData = await generateRes.json();
    
    if (generateRes.ok && generateData.generatedImage) {
      logTest('Generate image with valid template', true, 
        `Generated image for template: ${testTemplate.name}`);
    } else {
      logTest('Generate image with valid template', false, 
        generateData.error || 'Generation failed');
    }
    
    // Test 3.2: Generate with invalid template ID
    const invalidGenerateRes = await fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: 'invalid-template-id',
        imageData: testImageData
      })
    });
    
    logTest('Reject generation with invalid template ID', !invalidGenerateRes.ok, 
      `Status: ${invalidGenerateRes.status}`);
    
    // Test 3.3: Generate without image data
    const noImageRes = await fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: testTemplate.id
      })
    });
    
    logTest('Reject generation without image data', !noImageRes.ok, 
      `Status: ${noImageRes.status}`);
    
    // Test 3.4: Generate with malformed request
    const malformedRes = await fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid json'
    });
    
    logTest('Reject malformed generation request', !malformedRes.ok, 
      `Status: ${malformedRes.status}`);
    
  } catch (error) {
    logTest('Image generation tests', false, error.message);
  }
}

// Test 4: Download Functionality
async function testDownloadFunctionality() {
  console.log('\n💾 Testing Download Functionality...\n');
  
  try {
    // Generate an image first
    const templatesRes = await fetch(`${BASE_URL}/api/templates`);
    const templatesData = await templatesRes.json();
    
    if (!templatesData.templates || templatesData.templates.length === 0) {
      logTest('Download functionality tests', false, 'No templates available');
      return;
    }
    
    const testTemplate = templatesData.templates[0];
    const testImageData = createTestImageData('small');
    
    const generateRes = await fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: testTemplate.id,
        imageData: testImageData
      })
    });
    
    const generateData = await generateRes.json();
    
    if (generateRes.ok && generateData.generatedImage) {
      // Test 4.1: Verify generated image is valid base64
      const isValidBase64 = /^data:image\/(png|jpeg|jpg|webp);base64,/.test(generateData.generatedImage);
      logTest('Generated image is valid base64 format', isValidBase64, 
        `Format: ${generateData.mimeType || 'unknown'}`);
      
      // Test 4.2: Verify image can be decoded
      try {
        const base64Data = generateData.generatedImage.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        logTest('Generated image can be decoded', buffer.length > 0, 
          `Size: ${buffer.length} bytes`);
      } catch (error) {
        logTest('Generated image can be decoded', false, error.message);
      }
    } else {
      logTest('Download functionality tests', false, 'Could not generate image for download test');
    }
    
  } catch (error) {
    logTest('Download functionality tests', false, error.message);
  }
}

// Test 5: Admin Template Creation, Editing, and Deletion
async function testAdminTemplateManagement() {
  console.log('\n⚙️  Testing Admin Template Management...\n');
  
  let createdTemplateId = null;
  
  try {
    // Test 5.1: Create new template
    const newTemplate = {
      name: 'Test Template ' + Date.now(),
      category: 'character',
      prompt: 'This is a test template prompt for integration testing.',
      previewImage: createTestImageData('small')
    };
    
    const createRes = await fetch(`${BASE_URL}/api/templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTemplate)
    });
    
    const createData = await createRes.json();
    
    if (createRes.ok && createData.template) {
      createdTemplateId = createData.template.id;
      logTest('Create new template', true, `Template ID: ${createdTemplateId}`);
    } else {
      logTest('Create new template', false, createData.error || 'Creation failed');
      return;
    }
    
    // Test 5.2: Verify template was created
    const verifyRes = await fetch(`${BASE_URL}/api/templates/${createdTemplateId}`);
    const verifyData = await verifyRes.json();
    
    logTest('Verify created template exists', verifyRes.ok && verifyData.template.name === newTemplate.name, 
      `Template name: ${verifyData.template?.name}`);
    
    // Test 5.3: Update template
    const updatedTemplate = {
      name: 'Updated Test Template ' + Date.now(),
      category: 'product',
      prompt: 'Updated test template prompt.',
      previewImage: createTestImageData('small')
    };
    
    const updateRes = await fetch(`${BASE_URL}/api/templates/${createdTemplateId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTemplate)
    });
    
    const updateData = await updateRes.json();
    
    logTest('Update template', updateRes.ok && updateData.template.name === updatedTemplate.name, 
      `New name: ${updateData.template?.name}`);
    
    // Test 5.4: Verify template was updated
    const verifyUpdateRes = await fetch(`${BASE_URL}/api/templates/${createdTemplateId}`);
    const verifyUpdateData = await verifyUpdateRes.json();
    
    logTest('Verify template was updated', 
      verifyUpdateRes.ok && verifyUpdateData.template.name === updatedTemplate.name &&
      verifyUpdateData.template.category === updatedTemplate.category,
      `Category changed to: ${verifyUpdateData.template?.category}`);
    
    // Test 5.5: Delete template
    const deleteRes = await fetch(`${BASE_URL}/api/templates/${createdTemplateId}`, {
      method: 'DELETE'
    });
    
    logTest('Delete template', deleteRes.ok, `Status: ${deleteRes.status}`);
    
    // Test 5.6: Verify template was deleted
    const verifyDeleteRes = await fetch(`${BASE_URL}/api/templates/${createdTemplateId}`);
    
    logTest('Verify template was deleted', verifyDeleteRes.status === 404, 
      `Status: ${verifyDeleteRes.status}`);
    
    // Test 5.7: Try to delete non-existent template
    const deleteNonExistentRes = await fetch(`${BASE_URL}/api/templates/non-existent-id`, {
      method: 'DELETE'
    });
    
    logTest('Handle deletion of non-existent template', deleteNonExistentRes.status === 404, 
      `Status: ${deleteNonExistentRes.status}`);
    
    // Test 5.8: Create template with missing fields
    const incompleteTemplate = {
      name: 'Incomplete Template'
      // Missing category, prompt, previewImage
    };
    
    const incompleteRes = await fetch(`${BASE_URL}/api/templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incompleteTemplate)
    });
    
    logTest('Reject template creation with missing fields', !incompleteRes.ok, 
      `Status: ${incompleteRes.status}`);
    
  } catch (error) {
    logTest('Admin template management tests', false, error.message);
    
    // Cleanup: Try to delete the created template if it exists
    if (createdTemplateId) {
      try {
        await fetch(`${BASE_URL}/api/templates/${createdTemplateId}`, {
          method: 'DELETE'
        });
      } catch (cleanupError) {
        console.log('Cleanup failed:', cleanupError.message);
      }
    }
  }
}

// Test 6: Error Scenarios and Retry Functionality
async function testErrorHandling() {
  console.log('\n🚨 Testing Error Scenarios and Retry Functionality...\n');
  
  try {
    // Test 6.1: Invalid API endpoint
    const invalidEndpointRes = await fetch(`${BASE_URL}/api/invalid-endpoint`);
    logTest('Handle invalid API endpoint', invalidEndpointRes.status === 404, 
      `Status: ${invalidEndpointRes.status}`);
    
    // Test 6.2: Invalid HTTP method
    const invalidMethodRes = await fetch(`${BASE_URL}/api/templates`, {
      method: 'PATCH'
    });
    logTest('Handle invalid HTTP method', !invalidMethodRes.ok, 
      `Status: ${invalidMethodRes.status}`);
    
    // Test 6.3: Malformed JSON in request
    const malformedJsonRes = await fetch(`${BASE_URL}/api/templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{invalid json'
    });
    logTest('Handle malformed JSON request', !malformedJsonRes.ok, 
      `Status: ${malformedJsonRes.status}`);
    
    // Test 6.4: Missing required headers
    const noHeadersRes = await fetch(`${BASE_URL}/api/templates`, {
      method: 'POST',
      body: JSON.stringify({ name: 'Test' })
    });
    logTest('Handle missing Content-Type header', !noHeadersRes.ok || noHeadersRes.status >= 400, 
      `Status: ${noHeadersRes.status}`);
    
    // Test 6.5: Empty request body
    const emptyBodyRes = await fetch(`${BASE_URL}/api/templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: ''
    });
    logTest('Handle empty request body', !emptyBodyRes.ok, 
      `Status: ${emptyBodyRes.status}`);
    
    // Test 6.6: Test error response format
    const errorRes = await fetch(`${BASE_URL}/api/templates/invalid-id`);
    const errorData = await errorRes.json();
    
    const hasErrorFormat = errorData.error && typeof errorData.error === 'string';
    logTest('Error responses have correct format', hasErrorFormat, 
      `Error message: ${errorData.error}`);
    
  } catch (error) {
    logTest('Error handling tests', false, error.message);
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Integration Tests for Complete User Flows\n');
  console.log('=' .repeat(60));
  console.log(`Testing against: ${BASE_URL}`);
  console.log('=' .repeat(60));
  
  const startTime = Date.now();
  
  await testTemplateBrowsing();
  await testImageUpload();
  await testImageGeneration();
  await testDownloadFunctionality();
  await testAdminTemplateManagement();
  await testErrorHandling();
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  // Generate summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  
  const totalTests = TEST_RESULTS.length;
  const passedTests = TEST_RESULTS.filter(t => t.passed).length;
  const failedTests = totalTests - passedTests;
  const passRate = ((passedTests / totalTests) * 100).toFixed(1);
  
  console.log(`Total Tests: ${totalTests}`);
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`Pass Rate: ${passRate}%`);
  console.log(`Duration: ${duration}s`);
  
  // Save detailed results to file
  const resultsFile = 'TASK_31_TEST_RESULTS.json';
  fs.writeFileSync(resultsFile, JSON.stringify({
    summary: {
      totalTests,
      passedTests,
      failedTests,
      passRate: `${passRate}%`,
      duration: `${duration}s`,
      timestamp: new Date().toISOString()
    },
    results: TEST_RESULTS
  }, null, 2));
  
  console.log(`\n📄 Detailed results saved to: ${resultsFile}`);
  
  // Exit with appropriate code
  process.exit(failedTests > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});
