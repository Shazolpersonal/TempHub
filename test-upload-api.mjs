import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = 'http://localhost:3000';

console.log('🧪 Testing Upload API Endpoint\n');

// Test 1: Upload a valid image
async function testValidImageUpload() {
  console.log('Test 1: Upload valid image');
  
  try {
    // Create a small test image (1x1 PNG)
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    const formData = new FormData();
    const blob = new Blob([testImageBuffer], { type: 'image/png' });
    formData.append('image', blob, 'test.png');

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Valid image upload successful');
      console.log('   - Image URL:', data.data.imageUrl.substring(0, 50) + '...');
      console.log('   - Image Data length:', data.data.imageData.length);
    } else {
      console.log('❌ Valid image upload failed');
      console.log('   Error:', data.error);
    }
  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
  }
  console.log('');
}

// Test 2: Upload without file
async function testNoFileUpload() {
  console.log('Test 2: Upload without file');
  
  try {
    const formData = new FormData();

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok && data.error?.code === 'VALIDATION_ERROR') {
      console.log('✅ Correctly rejected upload without file');
      console.log('   - Error message:', data.error.message);
    } else {
      console.log('❌ Should have rejected upload without file');
    }
  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
  }
  console.log('');
}

// Test 3: Upload file that's too large (simulated)
async function testLargeFileUpload() {
  console.log('Test 3: Upload file exceeding 5MB');
  
  try {
    // Create a buffer larger than 5MB
    const largeBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB
    
    const formData = new FormData();
    const blob = new Blob([largeBuffer], { type: 'image/png' });
    formData.append('image', blob, 'large.png');

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok && data.error?.code === 'FILE_TOO_LARGE') {
      console.log('✅ Correctly rejected file exceeding 5MB');
      console.log('   - Error message:', data.error.message);
    } else {
      console.log('❌ Should have rejected large file');
    }
  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
  }
  console.log('');
}

// Test 4: Upload invalid file type
async function testInvalidFileType() {
  console.log('Test 4: Upload invalid file type');
  
  try {
    const textBuffer = Buffer.from('This is not an image');
    
    const formData = new FormData();
    const blob = new Blob([textBuffer], { type: 'text/plain' });
    formData.append('image', blob, 'test.txt');

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok && data.error?.code === 'INVALID_FILE_TYPE') {
      console.log('✅ Correctly rejected invalid file type');
      console.log('   - Error message:', data.error.message);
    } else {
      console.log('❌ Should have rejected invalid file type');
    }
  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
  }
  console.log('');
}

// Test 5: Upload different valid image formats
async function testDifferentImageFormats() {
  console.log('Test 5: Upload different valid image formats');
  
  const formats = [
    { ext: 'jpg', type: 'image/jpeg' },
    { ext: 'png', type: 'image/png' },
    { ext: 'webp', type: 'image/webp' },
  ];
  
  for (const format of formats) {
    try {
      const testImageBuffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      );
      
      const formData = new FormData();
      const blob = new Blob([testImageBuffer], { type: format.type });
      formData.append('image', blob, `test.${format.ext}`);

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log(`✅ ${format.ext.toUpperCase()} format accepted`);
      } else {
        console.log(`❌ ${format.ext.toUpperCase()} format rejected`);
      }
    } catch (error) {
      console.log(`❌ ${format.ext.toUpperCase()} test failed:`, error.message);
    }
  }
  console.log('');
}

// Run all tests
async function runTests() {
  console.log('Starting upload API tests...\n');
  console.log('Make sure the dev server is running on http://localhost:3000\n');
  
  await testValidImageUpload();
  await testNoFileUpload();
  await testLargeFileUpload();
  await testInvalidFileType();
  await testDifferentImageFormats();
  
  console.log('✨ All tests completed!');
}

runTests().catch(console.error);
