/**
 * Test script for the image generation API endpoint
 * Tests the /api/generate endpoint with various scenarios
 */

import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:3000/api/generate';

// Helper function to convert image to base64
function imageToBase64(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64 = imageBuffer.toString('base64');
    const ext = path.extname(imagePath).toLowerCase();
    let mimeType = 'image/jpeg';
    
    if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.webp') mimeType = 'image/webp';
    
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('Error reading image:', error.message);
    return null;
  }
}

// Test 1: Valid generation request
async function testValidGeneration() {
  console.log('\n🧪 Test 1: Valid generation request');
  console.log('=====================================');
  
  // Create a simple test image (1x1 pixel PNG)
  const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateId: 'template-1', // Assuming this exists from templates.json
        imageData: testImageBase64,
      }),
    });

    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Test passed: Image generation successful');
    } else {
      console.log('⚠️  Test result: Generation failed (may be expected if API key not configured)');
      console.log('Error:', data.error?.message);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Test 2: Missing template ID
async function testMissingTemplateId() {
  console.log('\n🧪 Test 2: Missing template ID');
  console.log('=====================================');
  
  const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageData: testImageBase64,
      }),
    });

    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.status === 400 && data.error?.code === 'VALIDATION_ERROR') {
      console.log('✅ Test passed: Validation error returned as expected');
    } else {
      console.log('❌ Test failed: Expected 400 validation error');
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Test 3: Missing image data
async function testMissingImageData() {
  console.log('\n🧪 Test 3: Missing image data');
  console.log('=====================================');
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateId: 'template-1',
      }),
    });

    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.status === 400 && data.error?.code === 'VALIDATION_ERROR') {
      console.log('✅ Test passed: Validation error returned as expected');
    } else {
      console.log('❌ Test failed: Expected 400 validation error');
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Test 4: Invalid template ID
async function testInvalidTemplateId() {
  console.log('\n🧪 Test 4: Invalid template ID');
  console.log('=====================================');
  
  const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateId: 'non-existent-template-id',
        imageData: testImageBase64,
      }),
    });

    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.status === 404 && data.error?.code === 'TEMPLATE_NOT_FOUND') {
      console.log('✅ Test passed: Template not found error returned as expected');
    } else {
      console.log('❌ Test failed: Expected 404 template not found error');
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Test 5: Invalid JSON body
async function testInvalidJson() {
  console.log('\n🧪 Test 5: Invalid JSON body');
  console.log('=====================================');
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json',
    });

    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.status === 500 && data.error?.code === 'GENERATION_FAILED') {
      console.log('✅ Test passed: Error handled gracefully');
    } else {
      console.log('⚠️  Test result: Error handled (status:', response.status, ')');
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Image Generation API Tests');
  console.log('=======================================');
  console.log('Make sure the Next.js dev server is running on http://localhost:3000');
  console.log('Run: npm run dev\n');

  await testValidGeneration();
  await testMissingTemplateId();
  await testMissingImageData();
  await testInvalidTemplateId();
  await testInvalidJson();

  console.log('\n✨ All tests completed!');
  console.log('\nNote: The valid generation test may fail if:');
  console.log('  - GEMINI_API_KEY is not configured in .env.local');
  console.log('  - The template ID does not exist in data/templates.json');
  console.log('  - The Gemini API has rate limits or other issues');
}

runTests();
