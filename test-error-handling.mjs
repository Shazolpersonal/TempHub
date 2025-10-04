/**
 * Error Handling Test Script
 * Tests various error scenarios across the application
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

const BASE_URL = 'http://localhost:3000';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60) + '\n');
}

function logTest(testName) {
  log(`\n▶ Testing: ${testName}`, 'blue');
}

function logSuccess(message) {
  log(`  ✓ ${message}`, 'green');
}

function logError(message) {
  log(`  ✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`  ⚠ ${message}`, 'yellow');
}

/**
 * Test 1: Invalid Template ID (404 Error)
 */
async function testInvalidTemplateId() {
  logTest('Invalid Template ID - Should return 404');
  
  try {
    const response = await fetch(`${BASE_URL}/api/templates/invalid-id-12345`);
    const data = await response.json();
    
    if (response.status === 404 && data.error?.code === 'TEMPLATE_NOT_FOUND') {
      logSuccess('Correctly returned 404 with TEMPLATE_NOT_FOUND error');
      logSuccess(`Error message: "${data.error.message}"`);
      return true;
    } else {
      logError(`Expected 404, got ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Test failed: ${error.message}`);
    return false;
  }
}

/**
 * Test 2: Missing Required Fields (Validation Error)
 */
async function testMissingRequiredFields() {
  logTest('Missing Required Fields - Should return validation error');
  
  try {
    const response = await fetch(`${BASE_URL}/api/templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '', // Empty name
        category: '',
        prompt: '',
        previewImage: '',
      }),
    });
    
    const data = await response.json();
    
    if (response.status === 400 && data.error?.code === 'VALIDATION_ERROR') {
      logSuccess('Correctly returned 400 with VALIDATION_ERROR');
      logSuccess(`Error message: "${data.error.message}"`);
      return true;
    } else {
      logError(`Expected 400 validation error, got ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Test failed: ${error.message}`);
    return false;
  }
}

/**
 * Test 3: Invalid File Type Upload
 */
async function testInvalidFileType() {
  logTest('Invalid File Type - Should reject non-image files');
  
  try {
    const formData = new FormData();
    // Create a fake text file
    const textBlob = new Blob(['This is not an image'], { type: 'text/plain' });
    formData.append('image', textBlob, 'test.txt');
    
    const response = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    if (response.status === 400 && data.error?.code === 'INVALID_FILE_TYPE') {
      logSuccess('Correctly rejected invalid file type');
      logSuccess(`Error message: "${data.error.message}"`);
      return true;
    } else {
      logError(`Expected 400 with INVALID_FILE_TYPE, got ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Test failed: ${error.message}`);
    return false;
  }
}

/**
 * Test 4: File Too Large
 */
async function testFileTooLarge() {
  logTest('File Too Large - Should reject files over 5MB');
  
  try {
    const formData = new FormData();
    // Create a fake large file (6MB)
    const largeBuffer = new Uint8Array(6 * 1024 * 1024);
    const largeBlob = new Blob([largeBuffer], { type: 'image/jpeg' });
    formData.append('image', largeBlob, 'large-image.jpg');
    
    const response = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    if (response.status === 400 && data.error?.code === 'FILE_TOO_LARGE') {
      logSuccess('Correctly rejected file over 5MB');
      logSuccess(`Error message: "${data.error.message}"`);
      return true;
    } else {
      logError(`Expected 400 with FILE_TOO_LARGE, got ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Test failed: ${error.message}`);
    return false;
  }
}

/**
 * Test 5: Missing Image in Upload
 */
async function testMissingImage() {
  logTest('Missing Image - Should return validation error');
  
  try {
    const formData = new FormData();
    // Don't add any image
    
    const response = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    if (response.status === 400 && data.error?.code === 'VALIDATION_ERROR') {
      logSuccess('Correctly returned validation error for missing image');
      logSuccess(`Error message: "${data.error.message}"`);
      return true;
    } else {
      logError(`Expected 400 with VALIDATION_ERROR, got ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Test failed: ${error.message}`);
    return false;
  }
}

/**
 * Test 6: Invalid Template ID in Generation
 */
async function testGenerationWithInvalidTemplate() {
  logTest('Generation with Invalid Template - Should return 404');
  
  try {
    const response = await fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: 'invalid-template-id',
        imageData: 'base64-fake-data',
      }),
    });
    
    const data = await response.json();
    
    if (response.status === 404 && data.error?.code === 'TEMPLATE_NOT_FOUND') {
      logSuccess('Correctly returned 404 for invalid template');
      logSuccess(`Error message: "${data.error.message}"`);
      return true;
    } else {
      logError(`Expected 404, got ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Test failed: ${error.message}`);
    return false;
  }
}

/**
 * Test 7: Missing Required Fields in Generation
 */
async function testGenerationMissingFields() {
  logTest('Generation Missing Fields - Should return validation error');
  
  try {
    const response = await fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Missing templateId and imageData
      }),
    });
    
    const data = await response.json();
    
    if (response.status === 400 && data.error?.code === 'VALIDATION_ERROR') {
      logSuccess('Correctly returned validation error');
      logSuccess(`Error message: "${data.error.message}"`);
      return true;
    } else {
      logError(`Expected 400 validation error, got ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Test failed: ${error.message}`);
    return false;
  }
}

/**
 * Test 8: Update Non-Existent Template
 */
async function testUpdateNonExistentTemplate() {
  logTest('Update Non-Existent Template - Should return 404');
  
  try {
    const response = await fetch(`${BASE_URL}/api/templates/non-existent-id`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Updated Name',
        category: 'product',
        prompt: 'Updated prompt',
        previewImage: '/path/to/image.jpg',
      }),
    });
    
    const data = await response.json();
    
    if (response.status === 404 && data.error?.code === 'TEMPLATE_NOT_FOUND') {
      logSuccess('Correctly returned 404 for non-existent template');
      logSuccess(`Error message: "${data.error.message}"`);
      return true;
    } else {
      logError(`Expected 404, got ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Test failed: ${error.message}`);
    return false;
  }
}

/**
 * Test 9: Delete Non-Existent Template
 */
async function testDeleteNonExistentTemplate() {
  logTest('Delete Non-Existent Template - Should return 404');
  
  try {
    const response = await fetch(`${BASE_URL}/api/templates/non-existent-id`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (response.status === 404 && data.error?.code === 'TEMPLATE_NOT_FOUND') {
      logSuccess('Correctly returned 404 for non-existent template');
      logSuccess(`Error message: "${data.error.message}"`);
      return true;
    } else {
      logError(`Expected 404, got ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Test failed: ${error.message}`);
    return false;
  }
}

/**
 * Test 10: Network Error Simulation (Invalid URL)
 */
async function testNetworkError() {
  logTest('Network Error - Should handle gracefully');
  
  try {
    const response = await fetch('http://localhost:9999/api/templates', {
      signal: AbortSignal.timeout(2000),
    });
    
    logError('Should have thrown a network error');
    return false;
  } catch (error) {
    if (error.name === 'TypeError' || error.name === 'AbortError') {
      logSuccess('Network error handled correctly');
      logSuccess(`Error type: ${error.name}`);
      return true;
    } else {
      logError(`Unexpected error type: ${error.name}`);
      return false;
    }
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  logSection('ERROR HANDLING TEST SUITE');
  log('Testing comprehensive error handling across the application\n', 'yellow');
  
  const tests = [
    { name: 'Invalid Template ID', fn: testInvalidTemplateId },
    { name: 'Missing Required Fields', fn: testMissingRequiredFields },
    { name: 'Invalid File Type', fn: testInvalidFileType },
    { name: 'File Too Large', fn: testFileTooLarge },
    { name: 'Missing Image Upload', fn: testMissingImage },
    { name: 'Generation Invalid Template', fn: testGenerationWithInvalidTemplate },
    { name: 'Generation Missing Fields', fn: testGenerationMissingFields },
    { name: 'Update Non-Existent Template', fn: testUpdateNonExistentTemplate },
    { name: 'Delete Non-Existent Template', fn: testDeleteNonExistentTemplate },
    { name: 'Network Error', fn: testNetworkError },
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      results.push({ name: test.name, passed: result });
    } catch (error) {
      logError(`Test "${test.name}" threw an error: ${error.message}`);
      results.push({ name: test.name, passed: false });
    }
  }
  
  // Summary
  logSection('TEST SUMMARY');
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;
  
  log(`Total Tests: ${total}`, 'cyan');
  log(`Passed: ${passed}`, 'green');
  log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%\n`, 'cyan');
  
  if (failed > 0) {
    log('Failed Tests:', 'red');
    results.filter(r => !r.passed).forEach(r => {
      log(`  - ${r.name}`, 'red');
    });
  }
  
  console.log('\n');
  
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  logError(`Fatal error: ${error.message}`);
  process.exit(1);
});
