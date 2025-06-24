# 🚀 Panduan Deployment Presensi QR Code

## Opsi Deployment

### 1. GitHub Pages (Gratis)

1. **Upload ke GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/presensi-qr-code.git
   git push -u origin main
   ```

2. **Setup GitHub Pages:**
   - Buka repository di GitHub
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
   - Save

3. **URL akan tersedia di:** `https://username.github.io/presensi-qr-code`

### 2. Netlify (Gratis)

1. **Drag & Drop:**
   - Buka [netlify.com](https://netlify.com)
   - Drag folder project ke area deploy
   - URL akan otomatis tersedia

2. **Via Git:**
   - Connect repository GitHub
   - Build command: kosong
   - Publish directory: `.`
   - Deploy

### 3. Vercel (Gratis)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

### 4. Local Server (Development)

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

## Setup Google Apps Script

### 1. Buat Google Spreadsheet

1. Buka [Google Sheets](https://sheets.google.com)
2. Buat spreadsheet baru
3. Copy ID dari URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

### 2. Setup Google Apps Script

1. Buka [Google Apps Script](https://script.google.com)
2. Buat project baru
3. Copy isi `google-apps-script.js`
4. Ganti `YOUR_SPREADSHEET_ID_HERE` dengan ID spreadsheet
5. Deploy sebagai Web App:
   - Deploy → New deployment
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Deploy

### 3. Update Website

1. Copy URL deployment Google Apps Script
2. Edit `script.js`:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'YOUR_DEPLOYMENT_URL';
   ```
3. Edit `admin-script.js`:
   ```javascript
   const ADMIN_GOOGLE_APPS_SCRIPT_URL = 'YOUR_DEPLOYMENT_URL';
   ```

## Konfigurasi Domain Custom (Opsional)

### Netlify
1. Domain settings → Add custom domain
2. Follow DNS instructions

### Vercel
1. Settings → Domains
2. Add domain
3. Configure DNS

## Environment Variables

Untuk production, gunakan environment variables:

```javascript
// Netlify
const GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

// Vercel
const GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;
```

## SSL/HTTPS

- **GitHub Pages:** Otomatis HTTPS
- **Netlify:** Otomatis HTTPS
- **Vercel:** Otomatis HTTPS
- **Local:** Gunakan ngrok untuk HTTPS

```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 8000
```

## Monitoring & Analytics

### Google Analytics
Tambahkan ke `index.html`:

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

### Error Tracking
Tambahkan Sentry atau LogRocket untuk error tracking.

## Backup & Recovery

### Google Spreadsheet
1. File → Download → Microsoft Excel
2. Backup otomatis di Google Drive

### Website Files
1. Backup ke GitHub
2. Download ZIP dari hosting provider

## Performance Optimization

### Minification
```bash
# Install terser
npm install -g terser

# Minify JavaScript
terser script.js -o script.min.js
terser admin-script.js -o admin-script.min.js
```

### Image Optimization
```bash
# Install imagemin
npm install -g imagemin-cli

# Optimize images
imagemin images/* --out-dir=images/optimized
```

### Caching
Tambahkan headers di hosting provider:

```
Cache-Control: public, max-age=31536000
```

## Security Checklist

- [ ] HTTPS enabled
- [ ] Google Apps Script access limited
- [ ] No sensitive data in client-side code
- [ ] Input validation implemented
- [ ] Rate limiting configured
- [ ] Regular backups scheduled

## Troubleshooting

### CORS Issues
- Pastikan Google Apps Script di-deploy sebagai Web App
- Set "Who has access" ke "Anyone"

### Camera Not Working
- Pastikan HTTPS
- Check browser permissions
- Test di incognito mode

### Data Not Saving
- Check Google Apps Script URL
- Verify spreadsheet permissions
- Check browser console for errors

## Support

Untuk bantuan lebih lanjut:
- Buka issue di GitHub
- Email: support@example.com
- Dokumentasi: [Link ke docs] 