#!/usr/bin/env node

/**
 * Pre-Deployment Verification Script
 * 
 * This script performs automated checks before deployment to ensure
 * the application is ready for production.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes
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

function checkmark() {
  return `${colors.green}✓${colors.reset}`;
}

function crossmark() {
  return `${colors.red}✗${colors.reset}`;
}

function warning() {
  return `${colors.yellow}⚠${colors.reset}`;
}

// Check results
const results = {
  passed: [],
  failed: [],
  warnings: [],
};

// 1. Check if .env.example exists
function checkEnvExample() {
  log('\n1. Checking .env.example...', 'cyan');
  
  if (fs.existsSync('.env.example')) {
    const content = fs.readFileSync('.env.example', 'utf-8');
    
    if (content.includes('GEMINI_API_KEY')) {
      log(`${checkmark()} .env.example exists with GEMINI_API_KEY`, 'green');
      results.passed.push('.env.example configured');
    } else {
      log(`${crossmark()} .env.example missing GEMINI_API_KEY`, 'red');
      results.failed.push('.env.example missing required variables');
    }
    
    // Check for placeholder values
    if (content.includes('your_') || content.includes('_here')) {
      log(`${checkmark()} .env.example uses placeholder values`, 'green');
      results.passed.push('.env.example has placeholders');
    } else {
      log(`${warning()} .env.example may contain real values`, 'yellow');
      results.warnings.push('.env.example should use placeholders');
    }
  } else {
    log(`${crossmark()} .env.example not found`, 'red');
    results.failed.push('.env.example missing');
  }
}

// 2. Check if .env.local is in .gitignore
function checkGitignore() {
  log('\n2. Checking .gitignore...', 'cyan');
  
  if (fs.existsSync('.gitignore')) {
    const content = fs.readFileSync('.gitignore', 'utf-8');
    
    if (content.includes('.env.local') || content.includes('.env*.local')) {
      log(`${checkmark()} .env.local is in .gitignore`, 'green');
      results.passed.push('.gitignore protects .env.local');
    } else {
      log(`${crossmark()} .env.local not in .gitignore`, 'red');
      results.failed.push('.env.local not protected');
    }
  } else {
    log(`${crossmark()} .gitignore not found`, 'red');
    results.failed.push('.gitignore missing');
  }
}

// 3. Check build output exists
function checkBuildOutput() {
  log('\n3. Checking build output...', 'cyan');
  
  if (fs.existsSync('.next')) {
    log(`${checkmark()} .next directory exists`, 'green');
    results.passed.push('Build output present');
    
    // Check for build manifest
    if (fs.existsSync('.next/build-manifest.json')) {
      log(`${checkmark()} Build manifest found`, 'green');
      results.passed.push('Build manifest valid');
    } else {
      log(`${warning()} Build manifest not found - run npm run build`, 'yellow');
      results.warnings.push('Build may be incomplete');
    }
  } else {
    log(`${crossmark()} .next directory not found - run npm run build`, 'red');
    results.failed.push('No build output');
  }
}

// 4. Check required files
function checkRequiredFiles() {
  log('\n4. Checking required files...', 'cyan');
  
  const requiredFiles = [
    'package.json',
    'next.config.js',
    'netlify.toml',
    'data/templates.json',
    'data/categories.json',
    'README.md',
    'DEPLOYMENT_GUIDE.md',
  ];
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      log(`${checkmark()} ${file}`, 'green');
      results.passed.push(`${file} exists`);
    } else {
      log(`${crossmark()} ${file} missing`, 'red');
      results.failed.push(`${file} missing`);
    }
  });
}

// 5. Check template data
function checkTemplateData() {
  log('\n5. Checking template data...', 'cyan');
  
  try {
    const templatesData = JSON.parse(fs.readFileSync('data/templates.json', 'utf-8'));
    
    if (templatesData.templates && Array.isArray(templatesData.templates)) {
      log(`${checkmark()} templates.json has valid structure`, 'green');
      log(`   Found ${templatesData.templates.length} templates`, 'blue');
      results.passed.push(`${templatesData.templates.length} templates configured`);
      
      // Check each template
      templatesData.templates.forEach((template, index) => {
        const required = ['id', 'name', 'category', 'prompt', 'previewImage'];
        const missing = required.filter(field => !template[field]);
        
        if (missing.length === 0) {
          log(`${checkmark()} Template ${index + 1}: ${template.name}`, 'green');
        } else {
          log(`${crossmark()} Template ${index + 1} missing: ${missing.join(', ')}`, 'red');
          results.failed.push(`Template ${index + 1} incomplete`);
        }
      });
    } else {
      log(`${crossmark()} templates.json has invalid structure`, 'red');
      results.failed.push('templates.json invalid');
    }
  } catch (error) {
    log(`${crossmark()} Error reading templates.json: ${error.message}`, 'red');
    results.failed.push('templates.json error');
  }
}

// 6. Check API routes
function checkAPIRoutes() {
  log('\n6. Checking API routes...', 'cyan');
  
  const apiRoutes = [
    'app/api/templates/route.ts',
    'app/api/templates/[id]/route.ts',
    'app/api/upload/route.ts',
    'app/api/generate/route.ts',
    'app/api/categories/route.ts',
  ];
  
  apiRoutes.forEach(route => {
    if (fs.existsSync(route)) {
      log(`${checkmark()} ${route}`, 'green');
      results.passed.push(`${route} exists`);
    } else {
      log(`${crossmark()} ${route} missing`, 'red');
      results.failed.push(`${route} missing`);
    }
  });
}

// 7. Check security configuration
function checkSecurity() {
  log('\n7. Checking security configuration...', 'cyan');
  
  // Check netlify.toml for security headers
  if (fs.existsSync('netlify.toml')) {
    const content = fs.readFileSync('netlify.toml', 'utf-8');
    
    const securityHeaders = [
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Referrer-Policy',
    ];
    
    securityHeaders.forEach(header => {
      if (content.includes(header)) {
        log(`${checkmark()} ${header} configured`, 'green');
        results.passed.push(`${header} set`);
      } else {
        log(`${warning()} ${header} not configured`, 'yellow');
        results.warnings.push(`${header} missing`);
      }
    });
  }
  
  // Check that API key is not in client code
  const clientFiles = [
    'components/template-gallery.tsx',
    'components/image-uploader.tsx',
    'app/(public)/page.tsx',
  ];
  
  let apiKeyInClient = false;
  clientFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      if (content.includes('GEMINI_API_KEY')) {
        log(`${crossmark()} API key reference found in ${file}`, 'red');
        results.failed.push(`API key in client code: ${file}`);
        apiKeyInClient = true;
      }
    }
  });
  
  if (!apiKeyInClient) {
    log(`${checkmark()} No API key references in client code`, 'green');
    results.passed.push('API key not in client code');
  }
}

// 8. Check documentation
function checkDocumentation() {
  log('\n8. Checking documentation...', 'cyan');
  
  const docs = [
    'README.md',
    'DEPLOYMENT_GUIDE.md',
    'PROJECT_SETUP.md',
    'API_ENDPOINTS.md',
    'TROUBLESHOOTING.md',
    'DEPLOYMENT_CHECKLIST.md',
    'SECURITY_REVIEW.md',
  ];
  
  docs.forEach(doc => {
    if (fs.existsSync(doc)) {
      log(`${checkmark()} ${doc}`, 'green');
      results.passed.push(`${doc} exists`);
    } else {
      log(`${warning()} ${doc} missing`, 'yellow');
      results.warnings.push(`${doc} not found`);
    }
  });
}

// 9. Check package.json scripts
function checkPackageScripts() {
  log('\n9. Checking package.json scripts...', 'cyan');
  
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    
    const requiredScripts = ['dev', 'build', 'start', 'lint'];
    
    requiredScripts.forEach(script => {
      if (pkg.scripts && pkg.scripts[script]) {
        log(`${checkmark()} Script "${script}" defined`, 'green');
        results.passed.push(`${script} script exists`);
      } else {
        log(`${crossmark()} Script "${script}" missing`, 'red');
        results.failed.push(`${script} script missing`);
      }
    });
  } catch (error) {
    log(`${crossmark()} Error reading package.json: ${error.message}`, 'red');
    results.failed.push('package.json error');
  }
}

// 10. Check image directory
function checkImageDirectory() {
  log('\n10. Checking image directory...', 'cyan');
  
  if (fs.existsSync('public/template-previews')) {
    log(`${checkmark()} public/template-previews directory exists`, 'green');
    results.passed.push('Image directory exists');
    
    const files = fs.readdirSync('public/template-previews');
    const imageFiles = files.filter(f => 
      f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp')
    );
    
    if (imageFiles.length > 0) {
      log(`${checkmark()} Found ${imageFiles.length} image(s)`, 'green');
      results.passed.push(`${imageFiles.length} preview images`);
    } else {
      log(`${warning()} No preview images found`, 'yellow');
      results.warnings.push('Add template preview images');
    }
  } else {
    log(`${crossmark()} public/template-previews directory missing`, 'red');
    results.failed.push('Image directory missing');
  }
}

// Print summary
function printSummary() {
  log('\n' + '='.repeat(60), 'cyan');
  log('DEPLOYMENT READINESS SUMMARY', 'cyan');
  log('='.repeat(60), 'cyan');
  
  log(`\n${colors.green}✓ Passed: ${results.passed.length}${colors.reset}`);
  if (results.passed.length > 0) {
    results.passed.forEach(item => log(`  • ${item}`, 'green'));
  }
  
  if (results.warnings.length > 0) {
    log(`\n${colors.yellow}⚠ Warnings: ${results.warnings.length}${colors.reset}`);
    results.warnings.forEach(item => log(`  • ${item}`, 'yellow'));
  }
  
  if (results.failed.length > 0) {
    log(`\n${colors.red}✗ Failed: ${results.failed.length}${colors.reset}`);
    results.failed.forEach(item => log(`  • ${item}`, 'red'));
  }
  
  log('\n' + '='.repeat(60), 'cyan');
  
  if (results.failed.length === 0) {
    log('\n✅ READY FOR DEPLOYMENT!', 'green');
    log('\nNext steps:', 'cyan');
    log('1. Review DEPLOYMENT_CHECKLIST.md', 'blue');
    log('2. Configure Netlify environment variables', 'blue');
    log('3. Push to Git repository', 'blue');
    log('4. Deploy to Netlify', 'blue');
    return 0;
  } else {
    log('\n❌ NOT READY FOR DEPLOYMENT', 'red');
    log('\nPlease fix the failed checks above before deploying.', 'yellow');
    return 1;
  }
}

// Run all checks
async function runChecks() {
  log('='.repeat(60), 'cyan');
  log('PRE-DEPLOYMENT VERIFICATION', 'cyan');
  log('='.repeat(60), 'cyan');
  
  checkEnvExample();
  checkGitignore();
  checkBuildOutput();
  checkRequiredFiles();
  checkTemplateData();
  checkAPIRoutes();
  checkSecurity();
  checkDocumentation();
  checkPackageScripts();
  checkImageDirectory();
  
  const exitCode = printSummary();
  process.exit(exitCode);
}

// Run the checks
runChecks().catch(error => {
  log(`\n${crossmark()} Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
