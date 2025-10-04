# TempHub Deployment Guide

Complete guide for deploying TempHub to Netlify and other platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Netlify Deployment (Recommended)](#netlify-deployment-recommended)
- [Alternative Deployment Options](#alternative-deployment-options)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting Deployment Issues](#troubleshooting-deployment-issues)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ A working local build: `npm run build` succeeds
- ✅ All tests passing: `npm test` succeeds
- ✅ A valid Gemini API key
- ✅ Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- ✅ A Netlify account (free tier works)

### Pre-Deployment Checklist

Run these commands to verify your app is ready:

```bash
# 1. Lint check
npm run lint

# 2. Run tests
npm test

# 3. Build for production
npm run build

# 4. Test production build locally
npm start
# Visit http://localhost:3000 and test key features

# 5. Test API endpoints
node test-api.mjs
node test-upload-api.mjs
node test-generate-api.mjs
```

If all checks pass, you're ready to deploy!

---

## Netlify Deployment (Recommended)

TempHub is optimized for Netlify deployment with built-in configuration.

### Step 1: Prepare Your Repository

1. **Ensure your code is pushed to Git:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Verify netlify.toml exists:**
   ```bash
   cat netlify.toml
   ```
   
   Should contain:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"

   [build.environment]
     NODE_VERSION = "18"

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```

### Step 2: Connect to Netlify

1. **Log in to Netlify:**
   - Visit [app.netlify.com](https://app.netlify.com/)
   - Sign in or create a free account

2. **Import your project:**
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider (GitHub, GitLab, or Bitbucket)
   - Authorize Netlify to access your repositories
   - Select your TempHub repository

3. **Configure build settings:**
   
   Netlify should auto-detect these settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Functions directory:** `.netlify/functions` (auto-configured)
   
   If not auto-detected, enter them manually.

### Step 3: Set Environment Variables

**Critical:** Set these before deploying!

1. **Navigate to environment variables:**
   - Site settings → Environment variables
   - Or during initial setup, click "Add environment variables"

2. **Add required variables:**

   | Key | Value | Example |
   |-----|-------|---------|
   | `GEMINI_API_KEY` | Your Gemini API key | `AIza...` |
   | `NEXT_PUBLIC_APP_URL` | Your site URL | `https://your-site.netlify.app` |

   **Important notes:**
   - Don't include quotes around values
   - No spaces before or after the equals sign
   - `GEMINI_API_KEY` is server-only (not exposed to browser)
   - `NEXT_PUBLIC_APP_URL` will be your Netlify URL (you can update this later)

3. **Save variables:**
   - Click "Save" or "Create variable"
   - Variables will be available for the next deployment

### Step 4: Deploy

1. **Trigger deployment:**
   - Click "Deploy site" (if in initial setup)
   - Or "Trigger deploy" → "Deploy site" (if already set up)

2. **Monitor build progress:**
   - Watch the build logs in real-time
   - Build typically takes 2-5 minutes
   - Look for any errors or warnings

3. **Wait for deployment:**
   - Status will change from "Building" to "Published"
   - You'll see a green checkmark when complete

### Step 5: Verify Deployment

1. **Visit your site:**
   - Click the site URL (e.g., `https://random-name-123.netlify.app`)
   - Or click "Open production deploy"

2. **Test key features:**
   - ✅ Homepage loads with template gallery
   - ✅ Category filters work
   - ✅ Click on a template
   - ✅ Upload an image (under 5MB)
   - ✅ Generate an AI image
   - ✅ Download the result
   - ✅ Visit `/admin` and test template management

3. **Check browser console:**
   - Open DevTools (F12)
   - Look for any errors in Console tab
   - Check Network tab for failed requests

### Step 6: Configure Custom Domain (Optional)

1. **Add custom domain:**
   - Site settings → Domain management
   - Click "Add custom domain"
   - Enter your domain (e.g., `temphub.com`)

2. **Configure DNS:**
   - Follow Netlify's instructions for your DNS provider
   - Add CNAME or A records as specified
   - Wait for DNS propagation (can take up to 48 hours)

3. **Enable HTTPS:**
   - Netlify automatically provisions SSL certificates
   - HTTPS will be enabled within a few minutes

4. **Update environment variable:**
   - Go to Site settings → Environment variables
   - Update `NEXT_PUBLIC_APP_URL` to your custom domain
   - Trigger a new deployment

### Step 7: Set Up Continuous Deployment

Netlify automatically deploys when you push to your main branch.

**To customize:**

1. **Configure deploy contexts:**
   - Site settings → Build & deploy → Deploy contexts
   - Choose which branches trigger deployments

2. **Set up deploy notifications:**
   - Site settings → Build & deploy → Deploy notifications
   - Add Slack, email, or webhook notifications

3. **Configure deploy previews:**
   - Automatically created for pull requests
   - Test changes before merging

---

## Alternative Deployment Options

### Vercel

TempHub can also be deployed to Vercel:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set environment variables:**
   ```bash
   vercel env add GEMINI_API_KEY
   vercel env add NEXT_PUBLIC_APP_URL
   ```

4. **Deploy to production:**
   ```bash
   vercel --prod
   ```

### Self-Hosted (VPS/Cloud)

For self-hosting on a VPS or cloud server:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Set up environment variables:**
   ```bash
   export GEMINI_API_KEY=your_key
   export NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Use a process manager:**
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start with PM2
   pm2 start npm --name "temphub" -- start
   pm2 save
   pm2 startup
   ```

5. **Set up reverse proxy (Nginx):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Docker

Deploy using Docker:

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   EXPOSE 3000
   
   CMD ["npm", "start"]
   ```

2. **Build image:**
   ```bash
   docker build -t temphub .
   ```

3. **Run container:**
   ```bash
   docker run -p 3000:3000 \
     -e GEMINI_API_KEY=your_key \
     -e NEXT_PUBLIC_APP_URL=https://your-domain.com \
     temphub
   ```

---

## Post-Deployment Checklist

After deploying, verify everything works:

### Functional Testing

- [ ] **Homepage**
  - [ ] Template gallery loads
  - [ ] Category filters work
  - [ ] Infinite scroll loads more templates
  - [ ] Template cards are clickable

- [ ] **Template Detail Page**
  - [ ] Template information displays correctly
  - [ ] Image uploader appears
  - [ ] Drag-and-drop works
  - [ ] Click-to-upload works

- [ ] **Image Generation**
  - [ ] Upload an image (under 5MB)
  - [ ] Click "Generate" button
  - [ ] Loading indicator appears
  - [ ] Generated image displays
  - [ ] Download button works
  - [ ] Downloaded file is valid

- [ ] **Admin Panel**
  - [ ] `/admin` page loads
  - [ ] Template list displays
  - [ ] "Create New Template" button works
  - [ ] Can create a new template
  - [ ] Can edit existing template
  - [ ] Can delete a template (with confirmation)

- [ ] **Error Handling**
  - [ ] Upload file over 5MB (should show error)
  - [ ] Upload invalid file type (should show error)
  - [ ] Try generation without image (button should be disabled)
  - [ ] Test with invalid template ID (should show 404)

### Performance Testing

- [ ] **Page Load Speed**
  - [ ] Homepage loads in under 3 seconds
  - [ ] Template pages load quickly
  - [ ] Images load progressively

- [ ] **Lighthouse Scores**
  ```bash
  # Run Lighthouse audit
  npx lighthouse https://your-site.netlify.app --view
  ```
  
  Target scores:
  - Performance: 80+
  - Accessibility: 90+
  - Best Practices: 90+
  - SEO: 90+

### Security Testing

- [ ] **API Key Security**
  - [ ] API key not visible in browser DevTools
  - [ ] API key not in client-side JavaScript
  - [ ] API routes only accessible from server

- [ ] **HTTPS**
  - [ ] Site loads over HTTPS
  - [ ] No mixed content warnings
  - [ ] SSL certificate is valid

### Mobile Testing

- [ ] **Responsive Design**
  - [ ] Test on mobile device (or Chrome DevTools mobile emulation)
  - [ ] Template gallery displays correctly
  - [ ] Image upload works on mobile
  - [ ] Touch interactions work
  - [ ] Admin panel usable on tablet

### Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS/iOS)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

## Monitoring and Maintenance

### Set Up Monitoring

1. **Netlify Analytics:**
   - Enable in Site settings → Analytics
   - Monitor traffic and performance

2. **Error Tracking:**
   - Consider integrating Sentry or similar
   - Track JavaScript errors in production

3. **Uptime Monitoring:**
   - Use UptimeRobot or similar service
   - Get alerts if site goes down

### Regular Maintenance

**Weekly:**
- Check Netlify build logs for warnings
- Review error logs (if error tracking is set up)
- Test key user flows

**Monthly:**
- Update dependencies: `npm update`
- Review and optimize bundle size
- Check API usage and costs

**Quarterly:**
- Review and update documentation
- Audit security dependencies: `npm audit`
- Performance optimization review

### Backup Strategy

1. **Code:**
   - Already backed up in Git repository
   - Consider multiple remotes (GitHub + GitLab)

2. **Data:**
   - `data/templates.json` is in Git
   - Consider periodic manual backups
   - For production, consider database migration

3. **Images:**
   - `public/template-previews/` is in Git
   - For user uploads, consider cloud storage (S3, Cloudinary)

---

## Troubleshooting Deployment Issues

### Build Fails on Netlify

**Check build logs:**
1. Go to Deploys tab
2. Click on failed deployment
3. Review build logs

**Common issues:**
- Missing dependencies: Add to `package.json`
- TypeScript errors: Fix type issues
- Environment variables: Ensure they're set
- Node version: Verify `netlify.toml` has correct version

**Solution:**
```bash
# Test build locally first
npm run build

# If it works locally, clear Netlify cache
# In Netlify: Deploys → Trigger deploy → Clear cache and deploy site
```

### Environment Variables Not Working

**Symptoms:**
- API calls fail with "API key not configured"
- Works locally but not on Netlify

**Solution:**
1. Verify variables are set in Netlify dashboard
2. Check variable names match exactly (case-sensitive)
3. Ensure no extra spaces or quotes
4. Redeploy after setting variables

### API Routes Return 404

**Symptoms:**
- `/api/templates` returns 404
- Works locally but not on Netlify

**Solution:**
1. Verify `netlify.toml` has redirect rules
2. Check Next.js plugin is configured
3. Ensure API routes are in `app/api/` directory
4. Clear cache and redeploy

### Function Timeout Errors

**Symptoms:**
```
Task timed out after 10.00 seconds
```

**Solution:**
1. Increase timeout in `netlify.toml`:
   ```toml
   [functions]
     timeout = 30
   ```
2. Optimize API calls (reduce image size)
3. Consider upgrading Netlify plan

### Images Not Loading

**Symptoms:**
- Template preview images show broken
- 404 errors for images

**Solution:**
1. Verify images are in `public/` directory
2. Check paths in `templates.json` are correct
3. Ensure images are committed to Git
4. Use absolute paths: `/template-previews/image.jpg`

### Slow Performance

**Symptoms:**
- Pages load slowly
- Poor Lighthouse scores

**Solution:**
1. Enable Next.js image optimization
2. Implement caching headers
3. Optimize bundle size
4. Use CDN for static assets
5. Enable Netlify's asset optimization

---

## Deployment Best Practices

### Before Each Deployment

1. **Test locally:**
   ```bash
   npm run build
   npm start
   ```

2. **Run tests:**
   ```bash
   npm test
   npm run lint
   ```

3. **Review changes:**
   ```bash
   git diff
   ```

4. **Update version:**
   - Update version in `package.json`
   - Tag release in Git

### Deployment Strategy

**For small changes:**
- Push to main branch
- Automatic deployment via Netlify

**For major changes:**
1. Create feature branch
2. Push and create pull request
3. Review deploy preview
4. Test thoroughly
5. Merge to main

**For critical fixes:**
1. Create hotfix branch
2. Make minimal changes
3. Test thoroughly
4. Deploy immediately
5. Monitor closely

### Rollback Procedure

If deployment causes issues:

1. **In Netlify:**
   - Go to Deploys tab
   - Find last working deployment
   - Click "Publish deploy"

2. **In Git:**
   ```bash
   git revert HEAD
   git push origin main
   ```

3. **Verify:**
   - Test that issue is resolved
   - Monitor for any side effects

---

## Security Considerations

### API Key Management

- ✅ Store API keys in environment variables
- ✅ Never commit API keys to Git
- ✅ Use different keys for dev/staging/production
- ✅ Rotate keys periodically
- ❌ Never expose keys in client-side code

### Access Control

- Consider adding authentication for admin panel (future enhancement)
- Implement rate limiting on API endpoints
- Monitor for suspicious activity

### HTTPS

- Always use HTTPS in production
- Netlify provides free SSL certificates
- Redirect HTTP to HTTPS

### Dependencies

- Regularly update dependencies: `npm update`
- Run security audits: `npm audit`
- Fix high-severity vulnerabilities immediately

---

## Getting Help

If you encounter deployment issues:

1. **Check documentation:**
   - [README.md](./README.md)
   - [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
   - [Netlify Docs](https://docs.netlify.com/)

2. **Review logs:**
   - Netlify build logs
   - Function logs
   - Browser console

3. **Test locally:**
   - Reproduce issue in local environment
   - Check for environment-specific problems

4. **Contact support:**
   - Netlify support (for platform issues)
   - Create GitHub issue (for app issues)

---

**Deployment Checklist Summary:**

- [ ] Code pushed to Git repository
- [ ] Local build succeeds
- [ ] Tests passing
- [ ] Connected to Netlify
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] All features tested
- [ ] Performance verified
- [ ] Mobile tested
- [ ] Monitoring set up

**Congratulations! Your TempHub instance is now live! 🎉**

---

**Last Updated:** October 2025
