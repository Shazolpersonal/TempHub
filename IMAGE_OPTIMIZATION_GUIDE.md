# Image Optimization Guide

This guide provides instructions for optimizing images in the TempHub application for production deployment.

## Current Image Usage

### Template Preview Images
**Location**: `public/template-previews/`

**Current Status**: Directory structure in place, placeholder images needed

**Required Images** (from `data/templates.json`):
1. `time-magazine.jpg` - TIME Magazine Cover template
2. `influencer-product.jpg` - Influencer Product Shot template
3. `superhero-character.jpg` - Superhero Character template

## Image Optimization Requirements

### File Format Recommendations

#### Best: WebP
- **Pros**: 25-35% smaller than JPEG, supports transparency
- **Cons**: Older browser support (but Next.js handles fallbacks)
- **Use for**: All template previews

#### Good: JPEG
- **Pros**: Universal support, good compression
- **Cons**: No transparency, larger than WebP
- **Use for**: Fallback or when WebP not available

#### Acceptable: PNG
- **Pros**: Lossless, transparency support
- **Cons**: Larger file sizes
- **Use for**: Images requiring transparency

### Size Guidelines

| Image Type | Recommended Size | Max File Size | Format |
|------------|------------------|---------------|--------|
| Template Preview | 800x600px | 500KB | WebP/JPEG |
| Uploaded Images | Any (validated) | 5MB | Any supported |
| Generated Images | API determined | N/A | PNG/JPEG |

## Optimization Tools

### Online Tools
1. **Squoosh** (https://squoosh.app/)
   - Free, browser-based
   - Supports WebP conversion
   - Visual quality comparison

2. **TinyPNG** (https://tinypng.com/)
   - Excellent compression
   - Batch processing
   - Free for small batches

3. **ImageOptim** (https://imageoptim.com/)
   - Mac app
   - Lossless optimization
   - Batch processing

### Command Line Tools

#### Using Sharp (Node.js)
```bash
npm install -g sharp-cli

# Convert to WebP
sharp -i input.jpg -o output.webp --webp

# Resize and optimize
sharp -i input.jpg -o output.jpg --resize 800 600 --quality 85
```

#### Using ImageMagick
```bash
# Install ImageMagick first
# Windows: choco install imagemagick
# Mac: brew install imagemagick

# Convert to WebP
magick input.jpg -quality 85 output.webp

# Resize and optimize
magick input.jpg -resize 800x600 -quality 85 output.jpg
```

## Optimization Workflow

### Step 1: Prepare Source Images
1. Collect high-quality source images for each template
2. Ensure images represent the template style accurately
3. Use images with appropriate licensing

### Step 2: Resize Images
```bash
# Target size: 800x600px (or maintain aspect ratio)
# This ensures consistent gallery display
```

### Step 3: Optimize and Convert
```bash
# Convert to WebP with 85% quality
# This provides good balance between quality and file size
```

### Step 4: Verify File Sizes
```bash
# Ensure each image is under 500KB
# If over, reduce quality or dimensions
```

### Step 5: Add to Project
```bash
# Copy optimized images to public/template-previews/
# Update data/templates.json if filenames changed
```

## Next.js Image Optimization

### Automatic Optimization
Next.js automatically optimizes images using the `<Image>` component:

```typescript
import Image from 'next/image';

<Image
  src="/template-previews/time-magazine.webp"
  alt="TIME Magazine Cover"
  width={800}
  height={600}
  loading="lazy"
  quality={85}
/>
```

### Benefits
- ✅ Automatic format conversion (WebP, AVIF)
- ✅ Responsive images (multiple sizes)
- ✅ Lazy loading by default
- ✅ Blur placeholder support
- ✅ CDN caching on Netlify

### Configuration
```javascript
// next.config.js
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

## Current Implementation

### Template Card Component
```typescript
// components/template-card.tsx
<Image
  src={template.previewImage}
  alt={template.name}
  width={400}
  height={300}
  className="w-full h-48 object-cover"
  loading="lazy"
/>
```

### Optimized Image Component
```typescript
// components/optimized-image.tsx
// Custom wrapper with error handling and blur placeholder
<Image
  src={src}
  alt={alt}
  width={width}
  height={height}
  placeholder="blur"
  blurDataURL={blurDataURL}
  loading="lazy"
/>
```

## Performance Metrics

### Target Metrics
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1

### Image Impact
- Optimized images reduce LCP by 40-60%
- Lazy loading improves initial page load
- WebP format reduces bandwidth by 25-35%

## Lazy Loading Strategy

### Gallery Implementation
```typescript
// components/template-gallery.tsx
// Uses Intersection Observer for infinite scroll
// Loads images only when visible in viewport
```

### Benefits
- Faster initial page load
- Reduced bandwidth usage
- Better mobile performance
- Improved user experience

## Checklist for Production

### Before Deployment
- [ ] All template preview images added
- [ ] Images optimized (under 500KB each)
- [ ] WebP format used where possible
- [ ] Images sized appropriately (800x600px)
- [ ] Alt text provided for accessibility
- [ ] Lazy loading enabled
- [ ] Next.js Image component used

### Verification
```bash
# Check image sizes
ls -lh public/template-previews/

# Verify total size
du -sh public/template-previews/

# Test in browser
# Open DevTools → Network → Img filter
# Verify images load efficiently
```

## Adding New Template Images

### Process
1. **Obtain Image**
   - Create or source high-quality image
   - Ensure proper licensing

2. **Optimize**
   ```bash
   # Resize to 800x600px
   # Convert to WebP
   # Ensure under 500KB
   ```

3. **Add to Project**
   ```bash
   # Copy to public/template-previews/
   cp optimized-image.webp public/template-previews/new-template.webp
   ```

4. **Update Template Data**
   ```json
   // data/templates.json
   {
     "previewImage": "/template-previews/new-template.webp"
   }
   ```

5. **Test**
   ```bash
   npm run dev
   # Verify image displays correctly
   ```

## Troubleshooting

### Image Not Loading
- Check file path is correct
- Verify file exists in `public/template-previews/`
- Check file permissions
- Clear Next.js cache: `rm -rf .next`

### Image Too Large
- Reduce dimensions
- Lower quality setting
- Convert to WebP
- Use compression tools

### Blurry Images
- Increase source image resolution
- Reduce compression
- Check Next.js quality setting
- Verify correct dimensions

### Slow Loading
- Enable lazy loading
- Reduce file sizes
- Use WebP format
- Check network throttling in DevTools

## Best Practices

### Do's
✅ Use Next.js Image component
✅ Provide width and height
✅ Use lazy loading
✅ Optimize before adding to project
✅ Use WebP format
✅ Provide alt text
✅ Test on slow connections

### Don'ts
❌ Use unoptimized images
❌ Skip width/height attributes
❌ Use PNG for photos
❌ Exceed 500KB per image
❌ Forget alt text
❌ Use external image hosts (for previews)

## Monitoring

### Performance Monitoring
```bash
# Lighthouse audit
npm run build
npm start
# Open Chrome DevTools → Lighthouse → Run audit
```

### Target Scores
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

### Image-Specific Metrics
- Image load time: < 500ms
- Total image size: < 2MB per page
- Number of images: Lazy load after 10

## Resources

### Tools
- [Squoosh](https://squoosh.app/) - Image optimization
- [TinyPNG](https://tinypng.com/) - PNG/JPEG compression
- [WebP Converter](https://developers.google.com/speed/webp) - Official WebP tools

### Documentation
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)
- [MDN Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

### Testing
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

## Summary

### Current Status
- ✅ Image optimization infrastructure in place
- ✅ Next.js Image component used throughout
- ✅ Lazy loading implemented
- ⚠️ Template preview images need to be added

### Action Items
1. Create or source template preview images
2. Optimize images using tools above
3. Add to `public/template-previews/`
4. Verify file sizes under 500KB
5. Test loading performance
6. Run Lighthouse audit

### Expected Results
- Fast page load times
- Efficient bandwidth usage
- Good Core Web Vitals scores
- Excellent user experience
