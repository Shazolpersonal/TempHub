# TempHub Troubleshooting Guide

This guide provides detailed solutions for common issues you might encounter while developing, deploying, or using TempHub.

## Table of Contents

- [Installation and Setup](#installation-and-setup)
- [Environment Configuration](#environment-configuration)
- [Development Server Issues](#development-server-issues)
- [API and Integration Issues](#api-and-integration-issues)
- [Image Upload and Generation](#image-upload-and-generation)
- [Build and Production Issues](#build-and-production-issues)
- [Netlify Deployment](#netlify-deployment)
- [Performance Issues](#performance-issues)
- [Browser-Specific Issues](#browser-specific-issues)
- [Data and Storage Issues](#data-and-storage-issues)

---

## Installation and Setup

### Issue: npm install fails with ERESOLVE errors

**Symptoms:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**

1. **Use legacy peer deps (quick fix):**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Clear cache and reinstall:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Update npm:**
   ```bash
   npm install -g npm@latest
   ```

### Issue: Node version incompatibility

**Symptoms:**
```
Error: The engine "node" is incompatible with this module
```

**Solution:**

1. Check your Node version:
   ```bash
   node --version
   ```

2. Install Node 18 or higher:
   - Download from [nodejs.org](https://nodejs.org/)
   - Or use nvm:
     ```bash
     nvm install 18
     nvm use 18
     ```

3. Verify installation:
   ```bash
   node --version  # Should show v18.x.x or higher
   npm --version   # Should show 9.x.x or higher
   ```

### Issue: Permission errors during installation

**Symptoms:**
```
Error: EACCES: permission denied
```

**Solutions:**

**On macOS/Linux:**
```bash
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

**On Windows:**
- Run Command Prompt or PowerShell as Administrator
- Or install Node.js in a user directory instead of Program Files

---

## Environment Configuration

### Issue: "Gemini API key is not configured"

**Symptoms:**
- Error message when trying to generate images
- API returns 502 Bad Gateway

**Solutions:**

1. **Verify .env.local exists:**
   ```bash
   ls -la .env.local
   ```

2. **Check file content:**
   ```bash
   cat .env.local
   ```
   
   Should contain:
   ```env
   GEMINI_API_KEY=your_actual_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Common mistakes to avoid:**
   - ❌ Extra spaces: `GEMINI_API_KEY= your_key` (space after =)
   - ❌ Quotes: `GEMINI_API_KEY="your_key"` (don't use quotes)
   - ❌ Wrong file name: `.env` instead of `.env.local`
   - ❌ Wrong location: File must be in project root

4. **Restart the development server:**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

### Issue: Environment variables not loading

**Symptoms:**
- `process.env.GEMINI_API_KEY` is undefined
- API calls fail with "API key not configured"

**Solutions:**

1. **Check Next.js environment variable rules:**
   - Server-only variables: No prefix needed (e.g., `GEMINI_API_KEY`)
   - Client-side variables: Must start with `NEXT_PUBLIC_` (e.g., `NEXT_PUBLIC_APP_URL`)

2. **Verify the variable is being used correctly:**
   ```typescript
   // ✅ Correct (server-side only)
   const apiKey = process.env.GEMINI_API_KEY;
   
   // ❌ Wrong (trying to access server var on client)
   // This will be undefined in browser
   const apiKey = process.env.GEMINI_API_KEY; // in client component
   ```

3. **Check file encoding:**
   - Ensure `.env.local` is UTF-8 encoded
   - No BOM (Byte Order Mark)

4. **Restart after changes:**
   - Always restart the dev server after modifying `.env.local`

### Issue: Getting API key from Google AI Studio

**Steps:**

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Select a Google Cloud project (or create a new one)
5. Copy the generated API key
6. Add it to `.env.local`:
   ```env
   GEMINI_API_KEY=AIza...your_key_here
   ```

**Note:** Keep your API key secret! Never commit it to version control.

---

## Development Server Issues

### Issue: Port 3000 already in use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

1. **Find and kill the process:**
   
   **On macOS/Linux:**
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```
   
   **On Windows:**
   ```cmd
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. **Use a different port:**
   ```bash
   PORT=3001 npm run dev
   ```

### Issue: Hot reload not working

**Symptoms:**
- Changes to files don't trigger page refresh
- Need to manually refresh browser

**Solutions:**

1. **Check file watcher limits (Linux):**
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

2. **Restart the dev server:**
   ```bash
   # Stop with Ctrl+C
   npm run dev
   ```

3. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

### Issue: TypeScript errors in IDE but builds successfully

**Symptoms:**
- Red squiggly lines in VS Code
- But `npm run build` works fine

**Solutions:**

1. **Restart TypeScript server in VS Code:**
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "TypeScript: Restart TS Server"
   - Press Enter

2. **Check TypeScript version:**
   ```bash
   npx tsc --version
   ```

3. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## API and Integration Issues

### Issue: Gemini API rate limit exceeded

**Symptoms:**
```json
{
  "error": {
    "code": "RATE_LIMIT",
    "message": "API rate limit exceeded. Please try again in a few minutes."
  }
}
```

**Solutions:**

1. **Wait before retrying:**
   - Free tier: 60 requests per minute
   - Wait 1-2 minutes before trying again

2. **Check your quota:**
   - Visit [Google AI Studio](https://makersuite.google.com/)
   - Check your API usage and limits

3. **Implement request throttling:**
   - Add delays between requests in your code
   - Use a queue system for batch operations

4. **Upgrade your plan:**
   - Consider upgrading to a paid tier for higher limits

### Issue: Gemini API returns "Invalid request"

**Symptoms:**
```json
{
  "error": {
    "code": "API_ERROR",
    "message": "Invalid request"
  }
}
```

**Solutions:**

1. **Check image format:**
   - Ensure image is properly base64 encoded
   - Verify MIME type is correct
   - Supported formats: JPG, PNG, WEBP, GIF, HEIC

2. **Check prompt:**
   - Ensure prompt is not empty
   - Verify prompt doesn't contain invalid characters
   - Keep prompt under 5000 characters

3. **Verify API key:**
   - Ensure API key is valid and active
   - Check that the key has proper permissions

4. **Test with a simple request:**
   ```bash
   node test-generate-api.mjs
   ```

### Issue: Network errors during API calls

**Symptoms:**
```json
{
  "error": {
    "code": "NETWORK_ERROR",
    "message": "Network connection issue"
  }
}
```

**Solutions:**

1. **Check internet connection:**
   ```bash
   ping google.com
   ```

2. **Test API accessibility:**
   ```bash
   curl https://generativelanguage.googleapis.com/
   ```

3. **Check firewall/proxy settings:**
   - Ensure your firewall allows outbound HTTPS connections
   - Configure proxy if needed

4. **Try with VPN disabled:**
   - Some VPNs may block API requests

---

## Image Upload and Generation

### Issue: "File too large" error

**Symptoms:**
```json
{
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File size exceeds the maximum limit of 5MB"
  }
}
```

**Solutions:**

1. **Compress the image:**
   - Use online tools: [TinyPNG](https://tinypng.com/), [Squoosh](https://squoosh.app/)
   - Or command line:
     ```bash
     # Using ImageMagick
     convert input.jpg -quality 85 -resize 2000x2000\> output.jpg
     ```

2. **Resize the image:**
   - Reduce dimensions to 2000x2000 or smaller
   - Most templates don't need ultra-high resolution

3. **Change format:**
   - Convert PNG to JPG (usually smaller)
   - Use WEBP for better compression

### Issue: "Invalid file type" error

**Symptoms:**
```json
{
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Invalid file type. Please upload a valid image file"
  }
}
```

**Solutions:**

1. **Check file extension:**
   - Supported: .jpg, .jpeg, .png, .webp, .gif, .heic, .heif
   - Not supported: .bmp, .tiff, .svg, .pdf

2. **Verify actual file type:**
   ```bash
   file your-image.jpg
   ```

3. **Convert to supported format:**
   - Use an image editor or online converter
   - Save as JPG or PNG

### Issue: Drag-and-drop not working

**Symptoms:**
- Dropping files does nothing
- No visual feedback when dragging

**Solutions:**

1. **Try click-to-upload instead:**
   - Click the upload area
   - Select file from file picker

2. **Check browser console:**
   - Open DevTools (F12)
   - Look for JavaScript errors

3. **Test in different browser:**
   - Try Chrome, Firefox, or Edge
   - Ensure browser is up to date

4. **Disable browser extensions:**
   - Some extensions interfere with drag-and-drop
   - Try in incognito/private mode

### Issue: Image generation takes too long

**Symptoms:**
- Generation spinner runs for several minutes
- Eventually times out

**Solutions:**

1. **Check image size:**
   - Larger images take longer to process
   - Try with a smaller image (under 1MB)

2. **Check API status:**
   - Visit [Google Cloud Status](https://status.cloud.google.com/)
   - Check for service disruptions

3. **Verify network speed:**
   - Slow upload speeds affect generation time
   - Test your internet speed

4. **Try a different template:**
   - Some prompts may be more complex
   - Test with a simpler template

### Issue: Generated images are poor quality

**Symptoms:**
- Blurry or pixelated results
- Doesn't match template style

**Solutions:**

1. **Use higher quality source images:**
   - Upload high-resolution images
   - Ensure good lighting and clarity

2. **Refine the template prompt:**
   - Be more specific about desired style
   - Include quality indicators: "high-resolution", "professional"
   - Add composition details

3. **Try different source images:**
   - Some images work better than others
   - Simple backgrounds often work best

4. **Adjust the prompt:**
   - See "Writing Effective Prompts" in README.md

---

## Build and Production Issues

### Issue: Build fails with TypeScript errors

**Symptoms:**
```
Type error: Property 'x' does not exist on type 'Y'
```

**Solutions:**

1. **Run type checking:**
   ```bash
   npx tsc --noEmit
   ```

2. **Fix reported errors:**
   - Address each type error
   - Add proper type annotations

3. **Check for missing types:**
   ```bash
   npm install --save-dev @types/node @types/react @types/react-dom
   ```

4. **Verify tsconfig.json:**
   - Ensure it matches the project requirements
   - Check `strict` mode settings

### Issue: Build succeeds but runtime errors occur

**Symptoms:**
- `npm run build` completes successfully
- But application crashes when running

**Solutions:**

1. **Test production build locally:**
   ```bash
   npm run build
   npm start
   ```

2. **Check for environment-specific code:**
   - Ensure code works in both dev and production
   - Check for `process.env.NODE_ENV` conditionals

3. **Review build output:**
   - Look for warnings in build logs
   - Check bundle size and optimization

4. **Test with production environment variables:**
   - Use production API keys
   - Set `NODE_ENV=production`

### Issue: Static file 404 errors

**Symptoms:**
- Images or assets return 404
- Works in dev but not in production

**Solutions:**

1. **Check file paths:**
   - Use absolute paths: `/template-previews/image.jpg`
   - Not relative: `../public/template-previews/image.jpg`

2. **Verify files are in public directory:**
   ```bash
   ls -la public/template-previews/
   ```

3. **Check case sensitivity:**
   - File names are case-sensitive in production
   - `Image.jpg` ≠ `image.jpg`

4. **Rebuild:**
   ```bash
   rm -rf .next
   npm run build
   ```

---

## Netlify Deployment

### Issue: Netlify build fails

**Symptoms:**
- Build fails in Netlify dashboard
- Works locally but not on Netlify

**Solutions:**

1. **Check build logs:**
   - Go to Netlify dashboard
   - Click on failed deployment
   - Review build logs for errors

2. **Verify Node version:**
   - Check `netlify.toml`:
     ```toml
     [build.environment]
       NODE_VERSION = "18"
     ```

3. **Check dependencies:**
   - Ensure all dependencies are in `package.json`
   - Not just `devDependencies`

4. **Test build locally:**
   ```bash
   npm run build
   ```

5. **Clear Netlify cache:**
   - In Netlify dashboard: Deploys > Trigger deploy > Clear cache and deploy site

### Issue: Environment variables not working on Netlify

**Symptoms:**
- API calls fail with "API key not configured"
- Works locally but not on Netlify

**Solutions:**

1. **Set environment variables in Netlify:**
   - Go to Site settings > Environment variables
   - Add:
     - `GEMINI_API_KEY`: Your API key
     - `NEXT_PUBLIC_APP_URL`: Your site URL

2. **Verify variable names:**
   - Must match exactly (case-sensitive)
   - No extra spaces

3. **Redeploy after setting variables:**
   - Trigger deploy > Clear cache and deploy site

4. **Check variable scope:**
   - Ensure variables are set for production context
   - Not just deploy previews

### Issue: API routes return 404 on Netlify

**Symptoms:**
- `/api/templates` returns 404
- Works locally but not on Netlify

**Solutions:**

1. **Verify netlify.toml configuration:**
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```

2. **Check Next.js plugin:**
   ```toml
   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

3. **Ensure API routes are in correct location:**
   - Should be in `app/api/` directory
   - Not `pages/api/`

4. **Redeploy:**
   - Clear cache and deploy

### Issue: Function timeout errors

**Symptoms:**
```
Task timed out after 10.00 seconds
```

**Solutions:**

1. **Increase function timeout:**
   - In `netlify.toml`:
     ```toml
     [functions]
       timeout = 30
     ```

2. **Optimize API calls:**
   - Reduce image size before sending to Gemini
   - Implement caching where possible

3. **Upgrade Netlify plan:**
   - Free tier: 10s timeout
   - Pro tier: 26s timeout

### Issue: Large file upload fails on Netlify

**Symptoms:**
- Uploads work locally but fail on Netlify
- "Payload too large" error

**Solutions:**

1. **Check Netlify limits:**
   - Free tier: 6MB function payload limit
   - Ensure images are under 5MB

2. **Implement client-side compression:**
   - Compress images before upload
   - Use browser APIs to resize

3. **Use external storage:**
   - Consider using Cloudinary or S3 for large files
   - Store only references in your app

---

## Performance Issues

### Issue: Slow page load times

**Symptoms:**
- Pages take several seconds to load
- Poor Lighthouse scores

**Solutions:**

1. **Enable production mode:**
   ```bash
   npm run build
   npm start
   ```

2. **Check image optimization:**
   - Use Next.js Image component
   - Ensure images are properly sized

3. **Analyze bundle size:**
   ```bash
   npm run build
   # Check output for large bundles
   ```

4. **Enable caching:**
   - Verify React Query is configured
   - Check browser cache headers

5. **Optimize fonts:**
   - Use `next/font` for font optimization
   - Preload critical fonts

### Issue: Infinite scroll not loading more items

**Symptoms:**
- Scroll to bottom but no more templates load
- Loading indicator doesn't appear

**Solutions:**

1. **Check template count:**
   - Need at least 10-15 templates to trigger scroll
   - Add more templates in admin panel

2. **Verify Intersection Observer:**
   - Check browser console for errors
   - Ensure browser supports Intersection Observer

3. **Test scroll behavior:**
   - Scroll all the way to bottom
   - Wait a moment for loading

4. **Check component state:**
   - Open React DevTools
   - Verify `hasMore` state is true

### Issue: Images loading slowly

**Symptoms:**
- Template preview images take long to load
- Blank spaces before images appear

**Solutions:**

1. **Optimize images:**
   - Compress preview images
   - Use appropriate dimensions (500x500 or smaller)

2. **Use Next.js Image component:**
   - Automatically optimizes images
   - Provides lazy loading

3. **Enable priority loading:**
   ```tsx
   <Image src="..." priority />
   ```

4. **Check CDN configuration:**
   - Ensure images are served from CDN
   - Verify cache headers

---

## Browser-Specific Issues

### Issue: Works in Chrome but not Safari

**Symptoms:**
- Features work in Chrome/Edge
- Broken in Safari

**Solutions:**

1. **Check for Safari-specific bugs:**
   - Test in Safari Developer Tools
   - Look for console errors

2. **Verify polyfills:**
   - Ensure modern features have fallbacks
   - Check browser compatibility

3. **Test file upload:**
   - Safari has stricter file input handling
   - Verify MIME types are correct

### Issue: Works on desktop but not mobile

**Symptoms:**
- Desktop browsers work fine
- Mobile browsers have issues

**Solutions:**

1. **Test responsive design:**
   - Use Chrome DevTools mobile emulation
   - Test on actual mobile devices

2. **Check touch events:**
   - Ensure drag-and-drop has touch support
   - Test tap targets are large enough

3. **Verify viewport settings:**
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1">
   ```

4. **Test mobile network conditions:**
   - Simulate slow 3G in DevTools
   - Optimize for mobile bandwidth

---

## Data and Storage Issues

### Issue: Templates not persisting

**Symptoms:**
- Create template in admin
- Template disappears after restart

**Solutions:**

1. **Check file permissions:**
   ```bash
   ls -la data/templates.json
   chmod 644 data/templates.json
   ```

2. **Verify file path:**
   - Ensure `data/templates.json` exists
   - Check it's in project root

3. **Check for write errors:**
   - Look at server logs
   - Verify disk space available

4. **Test manually:**
   ```bash
   node test-api.mjs
   ```

### Issue: templates.json corrupted

**Symptoms:**
- JSON parse errors
- Templates not loading

**Solutions:**

1. **Validate JSON:**
   ```bash
   cat data/templates.json | jq .
   ```

2. **Restore from backup:**
   - Check git history
   - Restore previous version

3. **Recreate file:**
   ```json
   {
     "templates": [],
     "categories": [
       {
         "id": "cat-1",
         "name": "Product",
         "slug": "product"
       }
     ]
   }
   ```

4. **Add templates via admin:**
   - Use admin panel to recreate templates

### Issue: Preview images not found

**Symptoms:**
- 404 errors for preview images
- Broken image icons

**Solutions:**

1. **Check file location:**
   ```bash
   ls -la public/template-previews/
   ```

2. **Verify file names:**
   - Must match exactly (case-sensitive)
   - Check for typos in templates.json

3. **Use correct paths:**
   - In templates.json: `/template-previews/image.jpg`
   - Not: `public/template-previews/image.jpg`

4. **Add missing images:**
   - Place images in `public/template-previews/`
   - Or update paths in templates.json

---

## Still Having Issues?

If none of these solutions work:

1. **Enable debug logging:**
   - Check browser console (F12)
   - Check server terminal output
   - Look for error stack traces

2. **Run diagnostic tests:**
   ```bash
   npm run lint
   npm test
   node test-api.mjs
   node test-upload-api.mjs
   node test-generate-api.mjs
   ```

3. **Check documentation:**
   - [README.md](./README.md) - Main documentation
   - [API_ENDPOINTS.md](./API_ENDPOINTS.md) - API reference
   - [ERROR_HANDLING_GUIDE.md](./ERROR_HANDLING_GUIDE.md) - Error details

4. **Create an issue:**
   - Include error messages and stack traces
   - Describe steps to reproduce
   - Mention your environment:
     - OS and version
     - Node.js version
     - Browser and version
     - Deployment platform

5. **Check for updates:**
   ```bash
   npm outdated
   npm update
   ```

---

**Last Updated:** October 2025
