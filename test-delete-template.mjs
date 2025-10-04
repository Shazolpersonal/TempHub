/**
 * Test script for template deletion functionality
 * Tests the DELETE /api/templates/[id] endpoint
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
  console.log('='.repeat(60));
}

async function testDeleteTemplate() {
  logSection('Testing Template Deletion Functionality');

  try {
    // Step 1: Get all templates first
    log('\n1. Fetching all templates...', 'blue');
    const getResponse = await fetch(`${BASE_URL}/api/templates`);
    const getResult = await getResponse.json();

    if (!getResult.success || !getResult.data?.templates) {
      log('❌ Failed to fetch templates', 'red');
      console.log(getResult);
      return;
    }

    const templates = getResult.data.templates;
    log(`✓ Found ${templates.length} templates`, 'green');

    if (templates.length === 0) {
      log('⚠ No templates available to delete', 'yellow');
      return;
    }

    // Display available templates
    log('\nAvailable templates:', 'blue');
    templates.forEach((t, i) => {
      console.log(`  ${i + 1}. ${t.name} (ID: ${t.id}) - ${t.category}`);
    });

    // Step 2: Create a test template to delete
    log('\n2. Creating a test template to delete...', 'blue');
    const createResponse = await fetch(`${BASE_URL}/api/templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Template for Deletion',
        category: 'product',
        prompt: 'This is a test template that will be deleted.',
        previewImage: '/template-previews/test.jpg',
      }),
    });

    const createResult = await createResponse.json();

    if (!createResult.success || !createResult.data?.template) {
      log('❌ Failed to create test template', 'red');
      console.log(createResult);
      return;
    }

    const testTemplate = createResult.data.template;
    log(`✓ Created test template: ${testTemplate.name} (ID: ${testTemplate.id})`, 'green');

    // Step 3: Delete the test template
    log('\n3. Deleting the test template...', 'blue');
    const deleteResponse = await fetch(`${BASE_URL}/api/templates/${testTemplate.id}`, {
      method: 'DELETE',
    });

    const deleteResult = await deleteResponse.json();

    if (!deleteResponse.ok || !deleteResult.success) {
      log('❌ Failed to delete template', 'red');
      console.log(deleteResult);
      return;
    }

    log(`✓ Template deleted successfully: ${deleteResult.data.message}`, 'green');

    // Step 4: Verify the template is deleted
    log('\n4. Verifying template is deleted...', 'blue');
    const verifyResponse = await fetch(`${BASE_URL}/api/templates/${testTemplate.id}`);
    const verifyResult = await verifyResponse.json();

    if (verifyResponse.status === 404 && verifyResult.error?.code === 'TEMPLATE_NOT_FOUND') {
      log('✓ Template successfully removed from database', 'green');
    } else {
      log('❌ Template still exists in database', 'red');
      console.log(verifyResult);
      return;
    }

    // Step 5: Verify template count decreased
    log('\n5. Verifying template count...', 'blue');
    const finalGetResponse = await fetch(`${BASE_URL}/api/templates`);
    const finalGetResult = await finalGetResponse.json();

    if (finalGetResult.success) {
      const finalCount = finalGetResult.data.templates.length;
      log(`✓ Current template count: ${finalCount}`, 'green');
      
      if (finalCount === templates.length) {
        log('✓ Template count matches original (test template removed)', 'green');
      } else {
        log(`⚠ Template count mismatch. Expected: ${templates.length}, Got: ${finalCount}`, 'yellow');
      }
    }

    // Step 6: Test deleting non-existent template
    log('\n6. Testing deletion of non-existent template...', 'blue');
    const nonExistentId = 'non-existent-template-id';
    const notFoundResponse = await fetch(`${BASE_URL}/api/templates/${nonExistentId}`, {
      method: 'DELETE',
    });

    const notFoundResult = await notFoundResponse.json();

    if (notFoundResponse.status === 404 && notFoundResult.error?.code === 'TEMPLATE_NOT_FOUND') {
      log('✓ Correctly returns 404 for non-existent template', 'green');
    } else {
      log('❌ Should return 404 for non-existent template', 'red');
      console.log(notFoundResult);
    }

    logSection('All Deletion Tests Passed! ✓');

  } catch (error) {
    log('\n❌ Test failed with error:', 'red');
    console.error(error);
  }
}

// Run the test
log('Starting template deletion tests...', 'cyan');
log('Make sure the Next.js dev server is running on http://localhost:3000\n', 'yellow');

testDeleteTemplate();
