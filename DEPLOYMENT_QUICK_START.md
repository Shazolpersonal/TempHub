# Deployment Quick Start Guide

**TempHub - AI Image Generation Platform**

This is a quick reference for deploying TempHub to Netlify. For detailed information, see DEPLOYMENT_CHECKLIST.md.

## ⚡ Quick Deploy (5 Minutes)

### Prerequisites
- ✅ Git repository with your code
- ✅ Netlify account (free tier works)
- ✅ Google Gemini API key

### Step 1: Pre-Deployment Check (30 seconds)
```bash
npm run pre-deploy
```

Expected output: `✅ READY FOR DEPLOYMENT!`

### Step 2: Push to Git (30 seconds)
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 3: Connect to Netlify (2 minutes)
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect your Git provider (GitHub, GitLab, etc.)
4. Select your repository

### Step 4: Configure Build (1 minute)
**Build settings** (should auto-detect):
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 18

### Step 5: Set Environment Variables (1 minute)
In Netlify Dashboard → Site Settings → Environment Variables:

```
GEMINI_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_APP_URL=https://your-site-name.netlify.app
```

⚠️ **Important**: Use your production API key, not the placeholder!

### Step 6: Deploy (30 seconds)
Click "Deploy site" and wait for build to complete (2-3 minutes).

### Step 7: Verify (1 minute)
Visit your site URL and test:
- ✅ Homepage loads
- ✅ Templates display
- ✅ Category filtering works
- ✅ Template detail page loads
- ✅ Image upload works
- ✅ Image generation works
- ✅ Admin panel accessible

## 🎉 Done!

Your site is live at: `https://your-site-name.netlify.app`

## 🔧 Common Issues

### Build Fails
```bash
# Check build logs in Netlify dashboard
# Common fix: Ensure Node version is 18+
```

### API Key Not Working
```bash
# Verify environment variable is set correctly
# Check for typos in variable name
# Ensure no extra spaces in API key
```

### Images Not Loading
```bash
# Add template preview images to public/template-previews/
# See IMAGE_OPTIMIZATION_GUIDE.md
```

### 404 Errors
```bash
# Ensure publish directory is set to ".next"
# Check that @netlify/plugin-nextjs is installed
```

## 📚 Full Documentation

For detailed information, see:
- **DEPLOYMENT_CHECKLIST.md** - Complete checklist
- **DEPLOYMENT_GUIDE.md** - Step-by-step guide
- **SECURITY_REVIEW.md** - Security information
- **TROUBLESHOOTING.md** - Common issues

## 🚀 Post-Deployment

### Update Production URL
After deployment, update your environment variable:
```
NEXT_PUBLIC_APP_URL=https://your-actual-site.netlify.app
```

### Monitor Your Site
- Netlify Dashboard → Deploys (view logs)
- Netlify Dashboard → Functions (monitor API calls)
- Netlify Dashboard → Analytics (track usage)

### Custom Domain (Optional)
1. Netlify Dashboard → Domain settings
2. Add custom domain
3. Follow DNS configuration instructions

## 🔄 Continuous Deployment

Netlify automatically deploys when you push to your main branch:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Netlify auto-deploys in 2-3 minutes
```

## 🛟 Need Help?

1. Check **TROUBLESHOOTING.md**
2. Review Netlify build logs
3. Check Netlify function logs
4. Verify environment variables

## ✅ Deployment Checklist

Quick checklist before deploying:

- [ ] Run `npm run pre-deploy` (passes)
- [ ] Code committed to Git
- [ ] Repository pushed to remote
- [ ] Netlify account created
- [ ] Repository connected to Netlify
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Site deployed successfully
- [ ] Homepage tested
- [ ] Image generation tested
- [ ] Admin panel tested

## 🎯 Success Criteria

Your deployment is successful when:

✅ Build completes without errors
✅ Site loads at Netlify URL
✅ Templates display correctly
✅ Image upload works
✅ Image generation works (with real API key)
✅ Download functionality works
✅ Admin panel accessible
✅ No console errors

## 📊 Performance

Expected performance metrics:
- Build time: 2-3 minutes
- Page load: < 2 seconds
- Image generation: 5-15 seconds (depends on Gemini API)
- Lighthouse score: > 90

## 🔐 Security

Your deployment is secure:
- ✅ API key stored in environment variables
- ✅ No sensitive data in Git
- ✅ Security headers configured
- ✅ File upload validation
- ✅ Input validation

## 💰 Cost

**Netlify Free Tier Includes**:
- 100GB bandwidth/month
- 300 build minutes/month
- Automatic HTTPS
- Continuous deployment
- Form handling

**Gemini API**:
- Check Google Cloud pricing
- Free tier available
- Pay per API call

## 🎓 Learn More

- [Netlify Documentation](https://docs.netlify.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Gemini API Documentation](https://ai.google.dev/docs)

---

**Ready to deploy?** Run `npm run pre-deploy` and follow the steps above!

**Questions?** Check DEPLOYMENT_CHECKLIST.md for detailed information.

**Issues?** See TROUBLESHOOTING.md for solutions.
