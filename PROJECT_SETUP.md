# TempHub Project Setup Guide

Complete guide for setting up TempHub for local development.

## Table of Contents

- [System Requirements](#system-requirements)
- [Initial Setup](#initial-setup)
- [Environment Configuration](#environment-configuration)
- [Development Tools Setup](#development-tools-setup)
- [Verification](#verification)
- [Next Steps](#next-steps)

---

## System Requirements

### Required Software

| Software | Minimum Version | Recommended | Download |
|----------|----------------|-------------|----------|
| Node.js | 18.0 | 18.17+ (LTS) | [nodejs.org](https://nodejs.org/) |
| npm | 9.0 | 9.6+ | Included with Node.js |
| Git | 2.0 | Latest | [git-scm.com](https://git-scm.com/) |

### Optional Tools

- **VS Code** - Recommended IDE ([download](https://code.visualstudio.com/))
- **Chrome** - For testing and debugging ([download](https://www.google.com/chrome/))
- **Postman** - For API testing ([download](https://www.postman.com/))

### System Specifications

- **OS**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 500MB for project + dependencies
- **Internet**: Required for API calls and package installation

---

## Initial Setup

### Step 1: Install Node.js

1. **Download Node.js:**
   - Visit [nodejs.org](https://nodejs.org/)
   - Download the LTS (Long Term Support) version
   - Choose the installer for your operating system

2. **Install Node.js:**
   - Run the installer
   - Follow the installation wizard
   - Accept default settings

3. **Verify installation:**
   ```bash
   node --version
   # Should output: v18.x.x or higher
   
   npm --version
   # Should output: 9.x.x or higher
   ```

**Troubleshooting:**
- If commands not found, restart your terminal
- On Windows, you may need to restart your computer
- Ensure Node.js is added to your PATH

### Step 2: Install Git

1. **Download Git:**
   - Visit [git-scm.com](https://git-scm.com/)
   - Download for your operating system

2. **Install Git:**
   - Run the installer
   - Use default settings (or customize as needed)

3. **Verify installation:**
   ```bash
   git --version
   # Should output: git version 2.x.x
   ```

4. **Configure Git (first time only):**
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

### Step 3: Clone the Repository

1. **Clone the project:**
   ```bash
   git clone <repository-url>
   cd temphub
   ```

2. **Verify you're in the right directory:**
   ```bash
   ls
   # Should see: package.json, app/, components/, etc.
   ```

### Step 4: Install Dependencies

1. **Install all packages:**
   ```bash
   npm install
   ```
   
   This will:
   - Download all required packages
   - Create `node_modules/` directory
   - Generate `package-lock.json`
   - Take 2-5 minutes depending on internet speed

2. **Verify installation:**
   ```bash
   ls node_modules
   # Should see many directories (next, react, etc.)
   ```

**Troubleshooting:**
- If installation fails, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#installation-issues)
- Try: `npm install --legacy-peer-deps`
- Or: `npm cache clean --force && npm install`

---

## Environment Configuration

### Step 1: Get a Gemini API Key

1. **Visit Google AI Studio:**
   - Go to [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account

2. **Create API Key:**
   - Click "Create API Key"
   - Select a Google Cloud project (or create new one)
   - Copy the generated API key
   - **Important:** Keep this key secret!

3. **API Key Format:**
   - Should start with `AIza`
   - Example: `AIzaSyD...` (39 characters)

### Step 2: Create Environment File

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit .env.local:**
   
   Open `.env.local` in your text editor and add your API key:
   
   ```env
   GEMINI_API_KEY=AIzaSyD...your_actual_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Important notes:**
   - Replace `AIzaSyD...your_actual_key_here` with your actual API key
   - No spaces around the `=` sign
   - No quotes around the values
   - File must be named exactly `.env.local`
   - File must be in the project root directory

### Step 3: Verify Environment Setup

1. **Check file exists:**
   ```bash
   ls -la .env.local
   # Should show the file
   ```

2. **Verify content (without revealing key):**
   ```bash
   cat .env.local | grep GEMINI_API_KEY
   # Should show: GEMINI_API_KEY=AIza...
   ```

3. **Security check:**
   - Ensure `.env.local` is in `.gitignore`
   - Never commit this file to Git
   - Never share your API key publicly

---

## Development Tools Setup

### VS Code Setup (Recommended)

1. **Install VS Code:**
   - Download from [code.visualstudio.com](https://code.visualstudio.com/)
   - Install for your operating system

2. **Open project in VS Code:**
   ```bash
   code .
   ```

3. **Install recommended extensions:**
   
   Open VS Code and install these extensions:
   - **ES7+ React/Redux/React-Native snippets** - Code snippets
   - **Prettier - Code formatter** - Code formatting
   - **ESLint** - Linting
   - **Tailwind CSS IntelliSense** - Tailwind autocomplete
   - **TypeScript Vue Plugin (Volar)** - TypeScript support

4. **Configure VS Code settings:**
   
   Create `.vscode/settings.json`:
   ```json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     },
     "typescript.tsdk": "node_modules/typescript/lib"
   }
   ```

### Browser DevTools Setup

1. **Install React DevTools:**
   - Chrome: [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
   - Firefox: [React Developer Tools](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

2. **Enable source maps:**
   - Already configured in `next.config.js`
   - Allows debugging of original TypeScript code

### Git Configuration

1. **Set up .gitignore:**
   - Already configured in the project
   - Ensures sensitive files aren't committed

2. **Verify .gitignore:**
   ```bash
   cat .gitignore | grep .env.local
   # Should show: .env.local
   ```

3. **Create a feature branch:**
   ```bash
   git checkout -b setup/initial-setup
   ```

---

## Verification

### Step 1: Run Linter

Check code quality:

```bash
npm run lint
```

**Expected output:**
```
✔ No ESLint warnings or errors
```

**If errors appear:**
- Review the error messages
- Fix any issues
- Run `npm run lint` again

### Step 2: Run Tests

Run unit tests:

```bash
npm test
```

**Expected output:**
```
✓ All tests passing
Test Suites: X passed, X total
Tests:       X passed, X total
```

**If tests fail:**
- Check error messages
- Ensure environment is set up correctly
- See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Step 3: Build the Project

Test production build:

```bash
npm run build
```

**Expected output:**
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

**If build fails:**
- Check error messages
- Ensure all dependencies are installed
- See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#build-issues)

### Step 4: Start Development Server

Start the dev server:

```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in X.Xs
```

**Verification checklist:**
- [ ] Server starts without errors
- [ ] No warnings in terminal
- [ ] Port 3000 is accessible

### Step 5: Test in Browser

1. **Open browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)

2. **Verify homepage:**
   - [ ] Page loads successfully
   - [ ] Template gallery displays
   - [ ] Category filters appear
   - [ ] No errors in browser console (F12)

3. **Test template page:**
   - [ ] Click on a template
   - [ ] Template detail page loads
   - [ ] Image uploader appears
   - [ ] No console errors

4. **Test admin panel:**
   - [ ] Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)
   - [ ] Admin dashboard loads
   - [ ] Template list displays
   - [ ] No console errors

### Step 6: Test API Endpoints

Run integration tests:

```bash
# In a new terminal (keep dev server running)
node test-api.mjs
```

**Expected output:**
```
✓ GET /api/templates - Success
✓ POST /api/templates - Success
✓ GET /api/templates/[id] - Success
✓ PUT /api/templates/[id] - Success
✓ DELETE /api/templates/[id] - Success
All tests passed!
```

**Additional tests:**
```bash
node test-upload-api.mjs      # Test image upload
node test-generate-api.mjs    # Test AI generation
node test-error-handling.mjs  # Test error scenarios
```

### Step 7: Test Image Generation

1. **Navigate to a template:**
   - Go to [http://localhost:3000](http://localhost:3000)
   - Click on any template

2. **Upload an image:**
   - Drag and drop an image (under 5MB)
   - Or click to browse and select

3. **Generate:**
   - Click "Generate" button
   - Wait for processing (10-30 seconds)
   - Verify generated image appears

4. **Download:**
   - Click "Download" button
   - Verify file downloads successfully

**If generation fails:**
- Check that `GEMINI_API_KEY` is set correctly
- Verify API key is valid
- Check browser console for errors
- See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#api-issues)

---

## Next Steps

### For Development

1. **Read the documentation:**
   - [README.md](./README.md) - Main documentation
   - [API_ENDPOINTS.md](./API_ENDPOINTS.md) - API reference
   - [MANUAL_TESTING_GUIDE.md](./MANUAL_TESTING_GUIDE.md) - Testing guide

2. **Explore the codebase:**
   - `app/` - Next.js pages and API routes
   - `components/` - React components
   - `lib/` - Utility functions and integrations
   - `types/` - TypeScript type definitions

3. **Review the spec:**
   - `.kiro/specs/ai-image-template-platform/requirements.md`
   - `.kiro/specs/ai-image-template-platform/design.md`
   - `.kiro/specs/ai-image-template-platform/tasks.md`

4. **Start developing:**
   - Create a feature branch
   - Make your changes
   - Test thoroughly
   - Submit a pull request

### For Testing

1. **Run all tests:**
   ```bash
   npm test                      # Unit tests
   npm run lint                  # Code quality
   node test-api.mjs            # API tests
   node test-user-flows.mjs     # User flow tests
   ```

2. **Manual testing:**
   - Follow [MANUAL_TESTING_GUIDE.md](./MANUAL_TESTING_GUIDE.md)
   - Test all user flows
   - Test error scenarios
   - Test on different browsers

3. **Performance testing:**
   ```bash
   npm run build
   npm start
   # Test production build performance
   ```

### For Deployment

1. **Prepare for deployment:**
   - Ensure all tests pass
   - Build succeeds locally
   - Environment variables documented

2. **Deploy to Netlify:**
   - Follow [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
   - Set up environment variables
   - Test deployed application

3. **Monitor and maintain:**
   - Set up monitoring
   - Regular updates
   - Security audits

---

## Quick Reference

### Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm test                 # Run unit tests
npm run test:watch       # Run tests in watch mode

# Testing
node test-api.mjs        # Test API endpoints
node test-upload-api.mjs # Test image upload
node test-generate-api.mjs # Test AI generation

# Git
git status               # Check status
git add .                # Stage changes
git commit -m "message"  # Commit changes
git push                 # Push to remote
```

### Important Files

```
.env.local               # Environment variables (DO NOT COMMIT)
package.json             # Dependencies and scripts
next.config.js           # Next.js configuration
tailwind.config.ts       # Tailwind CSS configuration
tsconfig.json            # TypeScript configuration
netlify.toml             # Netlify deployment config
```

### Important Directories

```
app/                     # Next.js App Router
  (public)/              # Public pages
  admin/                 # Admin panel
  api/                   # API routes
components/              # React components
lib/                     # Utilities and integrations
types/                   # TypeScript types
data/                    # JSON data storage
public/                  # Static assets
```

### Getting Help

- **Documentation:** See README.md and other docs
- **Troubleshooting:** See TROUBLESHOOTING.md
- **API Reference:** See API_ENDPOINTS.md
- **Browser Console:** Press F12 to open DevTools
- **Server Logs:** Check terminal where `npm run dev` is running

---

## Setup Checklist

Use this checklist to verify your setup:

- [ ] Node.js 18+ installed
- [ ] npm 9+ installed
- [ ] Git installed and configured
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Gemini API key obtained
- [ ] `.env.local` file created
- [ ] Environment variables set
- [ ] Linter passes (`npm run lint`)
- [ ] Tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Dev server starts (`npm run dev`)
- [ ] Homepage loads in browser
- [ ] Admin panel accessible
- [ ] API tests pass (`node test-api.mjs`)
- [ ] Image generation works
- [ ] VS Code configured (optional)
- [ ] Browser DevTools installed (optional)

**If all items are checked, you're ready to develop! 🎉**

---

## Troubleshooting Setup Issues

### Node.js Installation Issues

**Problem:** Node.js not found after installation

**Solution:**
1. Restart terminal/command prompt
2. On Windows, restart computer
3. Verify PATH includes Node.js
4. Reinstall Node.js if needed

### npm Install Fails

**Problem:** Errors during `npm install`

**Solution:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Environment Variables Not Loading

**Problem:** API key not working

**Solution:**
1. Verify `.env.local` exists in project root
2. Check file name is exactly `.env.local`
3. Ensure no spaces around `=` in file
4. Restart dev server after changes

### Port Already in Use

**Problem:** Port 3000 already in use

**Solution:**
```bash
# Kill process on port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port:
PORT=3001 npm run dev
```

### Build Fails

**Problem:** `npm run build` fails

**Solution:**
1. Check error messages
2. Run `npm run lint` to find issues
3. Fix TypeScript errors
4. Ensure all dependencies installed
5. Clear cache: `rm -rf .next`

For more troubleshooting, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md).

---

**Setup complete! Happy coding! 🚀**

---

**Last Updated:** October 2025
