// Simple API test script
// Run with: node test-api.mjs (after starting dev server with npm run dev)

const BASE_URL = 'http://localhost:3000/api';

async function testGetAllTemplates() {
  console.log('\n🧪 Testing GET /api/templates...');
  try {
    const response = await fetch(`${BASE_URL}/templates`);
    const data = await response.json();
    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(data, null, 2));
    return data.success;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function testGetTemplatesByCategory() {
  console.log('\n🧪 Testing GET /api/templates?category=product...');
  try {
    const response = await fetch(`${BASE_URL}/templates?category=product`);
    const data = await response.json();
    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(data, null, 2));
    return data.success;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function testGetTemplateById() {
  console.log('\n🧪 Testing GET /api/templates/template-1...');
  try {
    const response = await fetch(`${BASE_URL}/templates/template-1`);
    const data = await response.json();
    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(data, null, 2));
    return data.success;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function testGetNonExistentTemplate() {
  console.log('\n🧪 Testing GET /api/templates/non-existent (should return 404)...');
  try {
    const response = await fetch(`${BASE_URL}/templates/non-existent`);
    const data = await response.json();
    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(data, null, 2));
    return response.status === 404 && !data.success;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function testCreateTemplate() {
  console.log('\n🧪 Testing POST /api/templates...');
  try {
    const newTemplate = {
      name: 'Test Template',
      category: 'test',
      prompt: 'This is a test template prompt for API testing purposes.',
      previewImage: '/template-previews/test.jpg'
    };
    
    const response = await fetch(`${BASE_URL}/templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTemplate),
    });
    const data = await response.json();
    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(data, null, 2));
    
    // Store the created template ID for update/delete tests
    if (data.success && data.data?.template?.id) {
      return data.data.template.id;
    }
    return null;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

async function testCreateInvalidTemplate() {
  console.log('\n🧪 Testing POST /api/templates with invalid data (should return 400)...');
  try {
    const invalidTemplate = {
      name: 'Te', // Too short
      category: '',
      prompt: 'Short',
      previewImage: ''
    };
    
    const response = await fetch(`${BASE_URL}/templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidTemplate),
    });
    const data = await response.json();
    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(data, null, 2));
    return response.status === 400 && !data.success;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function testUpdateTemplate(templateId) {
  console.log(`\n🧪 Testing PUT /api/templates/${templateId}...`);
  try {
    const updatedData = {
      name: 'Updated Test Template',
      category: 'test',
      prompt: 'This is an updated test template prompt for API testing purposes.',
      previewImage: '/template-previews/test-updated.jpg'
    };
    
    const response = await fetch(`${BASE_URL}/templates/${templateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    const data = await response.json();
    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(data, null, 2));
    return data.success;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function testDeleteTemplate(templateId) {
  console.log(`\n🧪 Testing DELETE /api/templates/${templateId}...`);
  try {
    const response = await fetch(`${BASE_URL}/templates/${templateId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(data, null, 2));
    return data.success;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...');
  console.log('⚠️  Make sure the dev server is running (npm run dev)');
  
  const results = {
    passed: 0,
    failed: 0,
  };
  
  // Test GET all templates
  if (await testGetAllTemplates()) results.passed++;
  else results.failed++;
  
  // Test GET templates by category
  if (await testGetTemplatesByCategory()) results.passed++;
  else results.failed++;
  
  // Test GET template by ID
  if (await testGetTemplateById()) results.passed++;
  else results.failed++;
  
  // Test GET non-existent template
  if (await testGetNonExistentTemplate()) results.passed++;
  else results.failed++;
  
  // Test POST create template
  const createdTemplateId = await testCreateTemplate();
  if (createdTemplateId) results.passed++;
  else results.failed++;
  
  // Test POST with invalid data
  if (await testCreateInvalidTemplate()) results.passed++;
  else results.failed++;
  
  // Test PUT update template (if we created one)
  if (createdTemplateId) {
    if (await testUpdateTemplate(createdTemplateId)) results.passed++;
    else results.failed++;
  }
  
  // Test DELETE template (if we created one)
  if (createdTemplateId) {
    if (await testDeleteTemplate(createdTemplateId)) results.passed++;
    else results.failed++;
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log('='.repeat(50));
}

runTests().catch(console.error);
