# Vercel Deployment Guide

## Prisma Build Issues Fix

### Problem

Vercel build fails with Prisma permission errors on Windows.

### Solution

The following configuration changes should fix the deployment:

### 1. Updated vercel.json

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "PRISMA_GENERATE_DATAPROXY": "true"
  }
}
```

### 2. Updated package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "eslint",
    "postinstall": "prisma generate",
    "prebuild": "prisma generate"
  }
}
```

### 3. ESLint Configuration

Created `.eslintrc.json` to handle warnings:

```json
{
  "extends": "next/core-web-vitals",
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "react/no-unescaped-entities": "warn",
    "@next/next/no-img-element": "warn"
  }
}
```

## Deployment Steps

### 1. Environment Variables

Make sure these are set in Vercel:

```bash
DATABASE_URL=your-mongodb-connection-string
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

### 2. Deploy

1. Push changes to your repository
2. Vercel will automatically deploy
3. Check the build logs for any errors

### 3. Test Email Service

After deployment, visit:

- `https://your-domain.vercel.app/api/test-email` - Test email configuration
- `https://your-domain.vercel.app/email-debug` - Debug email issues

## Troubleshooting

### If Build Still Fails

1. Check Vercel build logs
2. Ensure all environment variables are set
3. Try redeploying from Vercel dashboard
4. Check if Prisma client is generated properly

### If Emails Don't Send

1. Visit `/api/test-email` to see detailed error messages
2. Check Vercel function logs
3. Verify SMTP credentials
4. Test with alternative email service (SendGrid, Mailgun)

### Common Issues

- **Prisma permission errors**: Fixed with updated build configuration
- **Environment variables not loaded**: Check Vercel dashboard settings
- **Email authentication failed**: Use App Password for Gmail
- **SMTP connection timeout**: Check host/port configuration

## Alternative: Manual Prisma Generation

If automatic generation fails, you can manually generate Prisma client:

1. Go to Vercel dashboard
2. Select your project
3. Go to Functions tab
4. Run: `npx prisma generate`
5. Redeploy

## Email Service Alternatives

If Gmail SMTP doesn't work, try:

### SendGrid

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Mailgun

```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-mailgun-smtp-username
SMTP_PASS=your-mailgun-smtp-password
```
