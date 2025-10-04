# TempHub

AI-powered image generation platform built with Next.js 14, React, TypeScript, and Google's Gemini 2.5 Flash Image Preview API.

Transform your photos into professional-quality images using pre-designed AI templates. No design skills required!

## Features

- 🎨 **Template Gallery**: Browse and explore AI image generation templates organized by categories
- 📤 **Image Upload**: Upload your photos with drag-and-drop support (up to 5MB)
- 🤖 **AI Generation**: Transform images using Google's Gemini 2.5 Flash Image Preview API
- 💾 **Download Results**: Download generated images instantly
- 🛠️ **Admin Panel**: Create, edit, and manage templates without authentication
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Performance Optimized**: Lazy loading, image optimization, and caching built-in

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: React Query + Zustand
- **AI**: Google Gemini 2.5 Flash Image Preview API
- **Deployment**: Netlify
- **Testing**: Vitest + React Testing Library

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

> **📖 For detailed setup instructions, see [PROJECT_SETUP.md](./PROJECT_SETUP.md)**

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn** package manager
- **Git** for version control
- **Google Gemini API key** ([Get one here](https://makersuite.google.com/app/apikey))

### Quick Installation

Follow these steps to set up the project locally:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd temphub
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   
   This will install all required packages including Next.js, React, TypeScript, Tailwind CSS, and other dependencies.

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
   
   > **Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

4. **Verify the setup:**
   
   Check that your environment is configured correctly:
   ```bash
   npm run lint
   ```
   
   This should complete without errors.

5. **Run the development server:**
   ```bash
   npm run dev
   ```
   
   The application will start on [http://localhost:3000](http://localhost:3000)

6. **Open your browser:**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

### Quick Start Verification

After installation, verify everything works:

1. ✅ Homepage loads with template gallery
2. ✅ Click on a template to view details
3. ✅ Upload a test image (under 5MB)
4. ✅ Generate an AI image
5. ✅ Visit `/admin` to access the admin panel

If any step fails, see the [Troubleshooting](#troubleshooting) section.

## Project Structure

```
temphub/
├── app/                      # Next.js App Router
│   ├── (public)/            # Public-facing pages
│   ├── admin/               # Admin panel pages
│   ├── api/                 # API routes
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # Shadcn/ui components
│   └── ...                  # Feature components
├── lib/                     # Utility functions
├── types/                   # TypeScript type definitions
├── data/                    # JSON data storage
└── public/                  # Static assets
```

## Usage Guide

### For Users

#### Browsing Templates

1. Visit the homepage to see all available templates
2. Use category filters (All, Product, Character, Magazine) to narrow your search
3. Scroll down to load more templates (infinite scroll)
4. Click on any template card to view details

#### Generating Images

1. **Select a Template**: Click on a template from the gallery
2. **Upload Your Image**: 
   - Drag and drop an image onto the upload area, or
   - Click to browse and select an image from your device
   - Supported formats: JPG, PNG, WEBP, GIF, HEIC (max 5MB)
3. **Generate**: Click the "Generate" button
4. **Wait**: The AI will process your image (typically 10-30 seconds)
5. **Download**: Once complete, click "Download" to save your generated image

#### Tips for Best Results

- Use high-quality images with good lighting
- Ensure the main subject is clearly visible
- Images with simple backgrounds work best
- Follow any specific guidance in the template description

### For Admins

#### Accessing the Admin Panel

Navigate to `/admin` in your browser. No authentication is required (as per project requirements).

#### Creating a Template

1. Go to `/admin` and click "Create New Template"
2. Fill in the required fields:
   - **Name**: A descriptive name for the template (e.g., "TIME Magazine Cover")
   - **Category**: Select from Product, Character, or Magazine
   - **Prompt**: Write detailed instructions for the AI (see prompt writing tips below)
   - **Preview Image**: Upload a sample image showing what the template produces
3. Click "Save Template"
4. The template will immediately appear in the public gallery

#### Editing a Template

1. Go to `/admin`
2. Find the template you want to edit
3. Click the "Edit" button
4. Modify any fields
5. Click "Save Changes"

#### Deleting a Template

1. Go to `/admin`
2. Find the template you want to delete
3. Click the "Delete" button
4. Confirm the deletion in the dialog
5. The template will be removed from the gallery immediately

#### Writing Effective Prompts

Good prompts are specific and detailed. Include:

- **Style description**: "professional magazine cover", "luxury product photo"
- **Composition details**: "centered subject", "dramatic lighting"
- **Visual elements**: "red border", "magazine text", "elegant background"
- **Quality indicators**: "high-resolution", "professional photography"

**Example prompt:**
```
Create a professional TIME Magazine cover featuring the person in the uploaded image. 
The cover should have the iconic TIME red border, the TIME logo at the top, and the 
person should be photographed in a professional, editorial style. Include realistic 
magazine text elements like 'Person of the Year' or relevant headlines. The lighting 
should be dramatic and professional, similar to actual TIME covers.
```

## API Documentation

Detailed API documentation is available in [API_ENDPOINTS.md](./API_ENDPOINTS.md).

### Quick Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/templates` | GET | Fetch all templates (with optional category filter) |
| `/api/templates` | POST | Create a new template |
| `/api/templates/[id]` | GET | Fetch a specific template |
| `/api/templates/[id]` | PUT | Update a template |
| `/api/templates/[id]` | DELETE | Delete a template |
| `/api/upload` | POST | Upload user image for generation |
| `/api/generate` | POST | Generate AI image using template |
| `/api/categories` | GET | Fetch all available categories |

For detailed request/response formats, error codes, and examples, see [API_ENDPOINTS.md](./API_ENDPOINTS.md).

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on http://localhost:3000 |
| `npm run build` | Build the application for production |
| `npm start` | Start the production server (requires build first) |
| `npm run lint` | Run ESLint to check code quality |
| `npm run format` | Format code with Prettier |
| `npm test` | Run unit tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ui` | Run tests with Vitest UI |

## Environment Variables

### Required Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key for AI image generation | Yes | `AIza...` |
| `NEXT_PUBLIC_APP_URL` | Application base URL | Yes | `http://localhost:3000` (dev) or `https://your-app.netlify.app` (prod) |

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Add it to your `.env.local` file

### Environment Setup

**For Local Development:**

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your actual API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. Never commit `.env.local` to version control (it's in `.gitignore`)

**For Production (Netlify):**

1. Go to your Netlify site dashboard
2. Navigate to Site settings > Environment variables
3. Add the following variables:
   - `GEMINI_API_KEY`: Your production Gemini API key
   - `NEXT_PUBLIC_APP_URL`: Your production URL (e.g., `https://your-app.netlify.app`)
4. Redeploy your site for changes to take effect

### Security Notes

- The `GEMINI_API_KEY` is a server-side only variable and is never exposed to the client
- All Gemini API calls are made through Next.js API routes (`/api/*`)
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser (use only for non-sensitive data)
- Never commit actual API keys to version control

### Development Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Follow the implementation tasks in `.kiro/specs/ai-image-template-platform/tasks.md`
   - Write tests for new functionality
   - Ensure code follows ESLint rules

3. **Test locally:**
   ```bash
   npm run lint
   npm test
   npm run build
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

5. **Push and create a pull request:**
   ```bash
   git push origin feature/your-feature-name
   ```

### Adding Shadcn/ui Components

To add new Shadcn/ui components to the project:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
```

Components will be added to the `components/ui/` directory.

### Code Style Guidelines

- Use TypeScript for all new files
- Follow the existing folder structure
- Use functional components with hooks
- Implement proper error handling
- Add JSDoc comments for complex functions
- Keep components small and focused
- Use Tailwind CSS for styling (avoid custom CSS when possible)

## Testing

The project includes comprehensive testing:

### Unit Tests

Test individual functions and utilities:

```bash
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:ui            # Open Vitest UI
```

**Test files:**
- `lib/__tests__/templates.test.ts` - Template CRUD operations
- `lib/__tests__/validation.test.ts` - Input validation functions
- `lib/__tests__/gemini.test.ts` - Gemini API integration
- `lib/__tests__/utils.test.ts` - Utility functions

### Integration Tests

Test API endpoints and user flows:

```bash
# Start dev server first
npm run dev

# In another terminal, run integration tests
node test-api.mjs              # Test template API endpoints
node test-upload-api.mjs       # Test image upload
node test-generate-api.mjs     # Test AI generation
node test-delete-template.mjs  # Test template deletion
node test-error-handling.mjs   # Test error scenarios
node test-user-flows.mjs       # Test complete user journeys
```

### Manual Testing

For manual testing guidance, see:
- [MANUAL_TESTING_GUIDE.md](./MANUAL_TESTING_GUIDE.md) - Comprehensive manual testing procedures
- [QUICK_TEST_REFERENCE.md](./QUICK_TEST_REFERENCE.md) - Quick testing checklist
- [RESPONSIVE_TESTING_GUIDE.md](./RESPONSIVE_TESTING_GUIDE.md) - Mobile and responsive testing

### Test Coverage

Current test coverage includes:
- ✅ Template CRUD operations
- ✅ File upload validation
- ✅ Image generation flow
- ✅ Error handling scenarios
- ✅ API endpoint responses
- ✅ Component rendering
- ✅ User interaction flows

## Deployment

### Deploying to Netlify

The application is configured for deployment on Netlify with the included `netlify.toml` configuration.

#### Prerequisites

- A Netlify account (free tier works)
- Your repository hosted on GitHub, GitLab, or Bitbucket
- A valid Gemini API key

#### Deployment Steps

1. **Connect Repository to Netlify:**
   - Log in to [Netlify](https://app.netlify.com/)
   - Click "Add new site" > "Import an existing project"
   - Choose your Git provider and select this repository
   - Netlify will automatically detect the Next.js configuration

2. **Configure Build Settings:**
   - Build command: `npm run build` (auto-detected)
   - Publish directory: `.next` (auto-detected)
   - Node version: 18 (configured in `netlify.toml`)

3. **Set Environment Variables:**
   - Go to Site settings > Environment variables
   - Add the following variables:
     ```
     GEMINI_API_KEY=your_production_gemini_api_key
     NEXT_PUBLIC_APP_URL=https://your-site-name.netlify.app
     ```
   - Click "Save"

4. **Deploy:**
   - Click "Deploy site"
   - Netlify will build and deploy your application
   - Future pushes to your main branch will trigger automatic deployments

#### Post-Deployment Verification

After deployment, verify the following:

1. **Homepage loads correctly** - Visit your site URL
2. **Templates display** - Check that template gallery shows templates
3. **Image upload works** - Try uploading an image on a template page
4. **Image generation works** - Generate an AI image to test the Gemini API integration
5. **Admin panel accessible** - Visit `/admin` and test template management
6. **API routes respond** - Check browser console for any API errors

#### Troubleshooting Deployment Issues

**Build Failures:**
- Check Netlify build logs for errors
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility (18+)

**API Errors:**
- Verify `GEMINI_API_KEY` is set correctly in Netlify environment variables
- Check that the API key has proper permissions
- Review function logs in Netlify dashboard

**Environment Variable Issues:**
- Ensure variables are set in Netlify (not just locally)
- Redeploy after adding/changing environment variables
- Check that `NEXT_PUBLIC_APP_URL` matches your actual site URL

**Image Upload/Generation Issues:**
- Verify Netlify function timeout settings (default 10s, may need increase)
- Check function logs for errors
- Ensure file size limits are within Netlify's constraints

#### Custom Domain (Optional)

To use a custom domain:
1. Go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow Netlify's instructions to configure DNS
4. Update `NEXT_PUBLIC_APP_URL` environment variable to your custom domain
5. Redeploy the site

## Documentation

### Setup and Deployment
- **[PROJECT_SETUP.md](./PROJECT_SETUP.md)** - Complete setup guide for local development
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deployment instructions for Netlify and other platforms
- **[SETUP_VERIFICATION.md](./SETUP_VERIFICATION.md)** - Verification checklist after setup

### API and Development
- **[API_ENDPOINTS.md](./API_ENDPOINTS.md)** - Detailed API documentation with request/response examples
- **[ERROR_HANDLING_GUIDE.md](./ERROR_HANDLING_GUIDE.md)** - Error handling patterns and best practices
- **[ERROR_HANDLING_QUICK_REFERENCE.md](./ERROR_HANDLING_QUICK_REFERENCE.md)** - Quick error reference

### Testing
- **[MANUAL_TESTING_GUIDE.md](./MANUAL_TESTING_GUIDE.md)** - Manual testing procedures and checklists
- **[QUICK_TEST_REFERENCE.md](./QUICK_TEST_REFERENCE.md)** - Quick testing checklist
- **[RESPONSIVE_TESTING_GUIDE.md](./RESPONSIVE_TESTING_GUIDE.md)** - Mobile and responsive testing

### Performance and Troubleshooting
- **[PERFORMANCE_OPTIMIZATIONS.md](./PERFORMANCE_OPTIMIZATIONS.md)** - Performance optimization techniques
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Comprehensive troubleshooting guide

## Troubleshooting

### Common Issues and Solutions

For comprehensive troubleshooting, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md).

#### Installation Issues

**Problem: `npm install` fails with dependency errors**

Solution:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

**Problem: Node version incompatibility**

Solution:
```bash
# Check your Node version
node --version

# Should be 18.0 or higher
# If not, install Node 18+ from https://nodejs.org/
```

#### Environment Variable Issues

**Problem: "Gemini API key is not configured" error**

Solution:
1. Verify `.env.local` exists in the project root
2. Check that `GEMINI_API_KEY` is set correctly
3. Ensure there are no extra spaces or quotes around the key
4. Restart the development server after changing environment variables

**Problem: Environment variables not loading**

Solution:
```bash
# Verify .env.local exists
ls -la .env.local

# Check the content (without revealing the actual key)
cat .env.local | grep GEMINI_API_KEY

# Restart the dev server
npm run dev
```

#### API and Generation Issues

**Problem: "Rate limit exceeded" error**

Solution:
- Wait a few minutes before trying again
- The Gemini API has rate limits on the free tier
- Consider upgrading your API plan if you need higher limits
- Check your API quota at [Google AI Studio](https://makersuite.google.com/)

**Problem: Image generation fails with "Invalid request" error**

Solution:
- Ensure your image is under 5MB
- Use supported formats: JPG, PNG, WEBP, GIF, HEIC
- Try a different image to rule out image-specific issues
- Check that the template prompt is not empty

**Problem: "Network error" during generation**

Solution:
1. Check your internet connection
2. Verify the Gemini API is accessible: https://generativelanguage.googleapis.com/
3. Check if your firewall or proxy is blocking the request
4. Try again in a few minutes (temporary network issues)

**Problem: Generated images are not what I expected**

Solution:
- Review and refine the template prompt
- Use more specific and detailed descriptions
- Include style references and composition details
- Try different source images
- See the "Writing Effective Prompts" section in the Usage Guide

#### Upload Issues

**Problem: "File too large" error**

Solution:
- Compress your image before uploading
- Use online tools like TinyPNG or ImageOptim
- Maximum file size is 5MB
- Consider resizing the image dimensions

**Problem: Drag-and-drop not working**

Solution:
- Try clicking the upload area instead
- Check browser console for JavaScript errors
- Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)
- Clear browser cache and reload

#### Build and Deployment Issues

**Problem: Build fails with TypeScript errors**

Solution:
```bash
# Check for type errors
npm run lint

# Fix any reported issues
# Then try building again
npm run build
```

**Problem: Netlify deployment fails**

Solution:
1. Check Netlify build logs for specific errors
2. Verify environment variables are set in Netlify dashboard
3. Ensure Node version is 18+ (set in `netlify.toml`)
4. Try building locally first: `npm run build`
5. Check that all dependencies are in `package.json` (not just `devDependencies`)

**Problem: API routes return 404 on Netlify**

Solution:
1. Verify `netlify.toml` is in the project root
2. Check that the Next.js plugin is configured
3. Ensure API routes are in the `app/api/` directory
4. Redeploy after making changes

**Problem: Environment variables not working on Netlify**

Solution:
1. Go to Site settings > Environment variables in Netlify
2. Verify all required variables are set:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_APP_URL`
3. Click "Trigger deploy" > "Clear cache and deploy site"
4. Wait for the new deployment to complete

#### Admin Panel Issues

**Problem: Can't access admin panel**

Solution:
- Navigate directly to `/admin` in your browser
- Check browser console for errors
- Verify the route exists: `app/admin/page.tsx`
- Clear browser cache and reload

**Problem: Template changes not appearing**

Solution:
1. Check that `data/templates.json` was updated
2. Refresh the page (Ctrl+F5 or Cmd+Shift+R)
3. Check browser console for errors
4. Verify the API endpoint is working: `/api/templates`

**Problem: Preview images not displaying**

Solution:
1. Verify images are in `public/template-previews/`
2. Check that image paths in templates.json are correct
3. Ensure image files have correct permissions
4. Try using absolute URLs for preview images

#### Performance Issues

**Problem: Slow page load times**

Solution:
- Check your internet connection
- Clear browser cache
- Verify images are optimized (use Next.js Image component)
- Check browser console for network errors
- Consider enabling production mode: `npm run build && npm start`

**Problem: Infinite scroll not working**

Solution:
- Check browser console for JavaScript errors
- Verify you have enough templates to trigger scrolling
- Try scrolling to the very bottom of the page
- Disable browser extensions that might interfere

### Getting Help

If you're still experiencing issues:

1. **Check existing documentation:**
   - [API_ENDPOINTS.md](./API_ENDPOINTS.md) - API documentation
   - [ERROR_HANDLING_GUIDE.md](./ERROR_HANDLING_GUIDE.md) - Error handling details
   - [MANUAL_TESTING_GUIDE.md](./MANUAL_TESTING_GUIDE.md) - Testing procedures

2. **Check the browser console:**
   - Open Developer Tools (F12)
   - Look for error messages in the Console tab
   - Check the Network tab for failed requests

3. **Check the server logs:**
   - Look at the terminal where `npm run dev` is running
   - Check for error messages or stack traces

4. **Verify your setup:**
   - Run `npm run lint` to check for code issues
   - Run `npm test` to verify core functionality
   - Try the integration tests: `node test-api.mjs`

5. **Create an issue:**
   - Include error messages and stack traces
   - Describe steps to reproduce the problem
   - Mention your environment (OS, Node version, browser)

## Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### Quick Start for Contributors

1. **Fork the repository** and create a feature branch
2. **Follow the code style** guidelines and existing patterns
3. **Write tests** for new functionality
4. **Update documentation** if you change APIs or add features
5. **Test thoroughly** before submitting
6. **Submit a pull request** with a clear description of changes

### Detailed Guidelines

For comprehensive contributing guidelines, see **[CONTRIBUTING.md](./CONTRIBUTING.md)**, which includes:

- Code of conduct
- Development workflow
- Coding standards
- Testing guidelines
- Commit message format
- Pull request process
- Issue reporting

### Quick Setup for Contributors

```bash
# Fork and clone the repository
git clone https://github.com/your-username/temphub.git
cd temphub

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local

# Create a feature branch
git checkout -b feature/your-feature

# Make your changes and test
npm run lint
npm test
npm run build

# Commit and push
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature
```

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- AI powered by [Google Gemini](https://deepmind.google/technologies/gemini/)
- Deployed on [Netlify](https://www.netlify.com/)

---

**TempHub** - Transform your photos with AI-powered templates 🎨✨
