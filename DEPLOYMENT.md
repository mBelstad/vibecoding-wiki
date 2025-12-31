# Deployment Guide - Vibecoding Wiki

This guide covers various deployment options for the Vibecoding Wiki.

## 🚀 Quick Deploy Options

### Option 1: Coolify (Recommended)

This project is configured for easy deployment on Coolify.

**Prerequisites:**
- Coolify instance running
- GitHub repository connected to Coolify

**Deployment Steps:**

1. **In Coolify Dashboard:**
   - Go to Projects → Add New Resource
   - Select "Public Repository" or connect your GitHub
   - Enter: `https://github.com/mBelstad/vibecoding-wiki`
   - Select branch: `main`

2. **Build Configuration:**
   - Build Pack: `Dockerfile`
   - Dockerfile: `Dockerfile` (auto-detected)
   - Port: `80`

3. **Domain Configuration:**
   - Add your domain (e.g., `wiki.yourdomain.com`)
   - Enable SSL (Let's Encrypt)

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (~1-2 minutes)

**Health Check:**
- Endpoint: `/health`
- The container includes a health check that Coolify will monitor

**Features Included:**
- ✅ Nginx-based static serving
- ✅ Gzip compression enabled
- ✅ Security headers configured
- ✅ Cache headers for static assets
- ✅ Health check endpoint
- ✅ Traefik-ready labels

---

### Option 2: GitHub Pages

1. **Create a GitHub repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Vibecoding Wiki"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/vibecoding-wiki.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`
   - Save

3. **Access your site**
   - URL: `https://YOUR_USERNAME.github.io/vibecoding-wiki/`

### Option 2: Netlify

1. **Deploy via Drag & Drop**
   - Go to [netlify.com](https://netlify.com)
   - Drag the entire folder to Netlify Drop
   - Done! You'll get a URL like `random-name.netlify.app`

2. **Deploy via CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

3. **Deploy via Git**
   - Connect your GitHub repository
   - Build command: (leave empty)
   - Publish directory: `/`

### Option 3: Vercel

1. **Deploy via CLI**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Deploy via Git**
   - Import your GitHub repository
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: `./`

### Option 4: Static Hosting Services

Works with any static hosting:
- **Cloudflare Pages**
- **AWS S3 + CloudFront**
- **Azure Static Web Apps**
- **Google Cloud Storage**
- **DigitalOcean App Platform**

## 📦 Pre-Deployment Checklist

- [ ] Run `node convert-markdown.js` to ensure content is up-to-date
- [ ] Test locally with `./serve.sh` or `python3 -m http.server`
- [ ] Verify all features work:
  - [ ] Landing page loads
  - [ ] Full playbook loads
  - [ ] Quickstart loads
  - [ ] Search works (Cmd/Ctrl+K)
  - [ ] Theme toggle works
  - [ ] Language toggle works
  - [ ] Checklist persists
  - [ ] Code copy buttons work
  - [ ] TOC navigation works
  - [ ] Mobile menu works
- [ ] Check browser console for errors
- [ ] Test on mobile device or responsive mode

## 🔧 Configuration

### Custom Domain

**GitHub Pages:**
1. Add a `CNAME` file with your domain:
   ```
   wiki.yourdomain.com
   ```
2. Configure DNS:
   ```
   Type: CNAME
   Name: wiki
   Value: YOUR_USERNAME.github.io
   ```

**Netlify/Vercel:**
- Add custom domain in dashboard
- Follow DNS configuration instructions

### Analytics (Optional)

Add to `<head>` of all HTML files:

**Google Analytics:**
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

**Plausible Analytics:**
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

### SEO Optimization

Add to `<head>` of each page:

```html
<!-- SEO Meta Tags -->
<meta name="description" content="Vibecoding Playbook - Keep the speed of vibecoding while maintaining code quality">
<meta name="keywords" content="vibecoding, cursor, claude, ai coding, development workflow">
<meta name="author" content="Your Name">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://yourdomain.com/">
<meta property="og:title" content="Vibecoding Playbook">
<meta property="og:description" content="A comprehensive guide for using AI assistants effectively">
<meta property="og:image" content="https://yourdomain.com/og-image.png">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://yourdomain.com/">
<meta property="twitter:title" content="Vibecoding Playbook">
<meta property="twitter:description" content="A comprehensive guide for using AI assistants effectively">
<meta property="twitter:image" content="https://yourdomain.com/og-image.png">
```

### Favicon

Add to `<head>`:
```html
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<link rel="icon" type="image/png" href="/assets/favicon.png">
```

## 🔒 Security Headers

For production, add these headers (via hosting provider):

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Netlify** - Create `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

**Vercel** - Create `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

## 🚦 Performance Optimization

### 1. Enable Compression
Most hosting providers enable gzip/brotli automatically.

### 2. Cache Headers
Set cache headers for static assets:
```
Cache-Control: public, max-age=31536000, immutable
```

### 3. CDN
Use a CDN for global distribution:
- Cloudflare (free tier available)
- AWS CloudFront
- Fastly

### 4. Image Optimization
If you add images:
- Use WebP format
- Compress images (TinyPNG, Squoosh)
- Add lazy loading: `loading="lazy"`

## 📊 Monitoring

### Uptime Monitoring
- [UptimeRobot](https://uptimerobot.com) (free)
- [Pingdom](https://pingdom.com)
- [StatusCake](https://statuscake.com)

### Performance Monitoring
- [Google PageSpeed Insights](https://pagespeed.web.dev)
- [WebPageTest](https://webpagetest.org)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

## 🔄 Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Convert Markdown
        run: node convert-markdown.js
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

## 🐛 Troubleshooting

### Issue: Content not loading
- Check browser console for errors
- Verify `playbook-*-content.html` files exist
- Run `node convert-markdown.js` again

### Issue: 404 on GitHub Pages
- Ensure repository is public
- Check Pages settings are correct
- Wait 5-10 minutes after enabling

### Issue: Styles not loading
- Check file paths are relative
- Verify `css/styles.css` exists
- Clear browser cache

### Issue: Search not working
- Check `js/search.js` is loaded
- Verify content is loaded before search initializes
- Check browser console for errors

## 📱 Testing Checklist

Before going live:

- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile (iOS Safari, Chrome Mobile)
- [ ] Test all interactive features
- [ ] Verify all links work
- [ ] Check responsive breakpoints
- [ ] Test with slow network (throttling)
- [ ] Validate HTML (validator.w3.org)
- [ ] Check accessibility (WAVE, axe)
- [ ] Run Lighthouse audit
- [ ] Test with JavaScript disabled (graceful degradation)

## 🎯 Post-Deployment

1. **Submit to Search Engines**
   - Google Search Console
   - Bing Webmaster Tools

2. **Create Sitemap** (optional)
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://yourdomain.com/</loc>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>https://yourdomain.com/playbook-full.html</loc>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>https://yourdomain.com/playbook-quickstart.html</loc>
       <priority>0.8</priority>
     </url>
   </urlset>
   ```

3. **Add robots.txt**
   ```
   User-agent: *
   Allow: /
   
   Sitemap: https://yourdomain.com/sitemap.xml
   ```

## 🎉 You're Live!

Your Vibecoding Wiki is now deployed and accessible to the world. Share the link with your team and community!

---

**Need Help?**
- Check the [README.md](README.md) for local development
- Review [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for technical details

