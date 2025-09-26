# Email Service Debug Guide

## Common Issues with Email Sending in Production

### 1. Environment Variables Not Set

Make sure these environment variables are set in your Vercel deployment:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 2. Gmail App Password Required

If using Gmail, you need to:

1. Enable 2-Factor Authentication on your Google account
2. Generate an "App Password" (not your regular password)
3. Use the App Password as `SMTP_PASS`

### 3. Alternative Email Services

#### Option A: Gmail (Recommended)

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
```

#### Option B: SendGrid

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### Option C: Mailgun

```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-mailgun-smtp-username
SMTP_PASS=your-mailgun-smtp-password
```

### 4. Testing Email Service

Visit: `https://your-domain.vercel.app/api/test-email`

This will:

- Test SMTP connection
- Show environment variable status
- Attempt to send a test email
- Display detailed error messages

### 5. Debug Steps

1. **Check Environment Variables in Vercel:**

   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Verify all SMTP variables are set

2. **Check Vercel Function Logs:**

   - Go to Functions tab in Vercel dashboard
   - Look for error messages in the logs
   - Check if environment variables are being loaded

3. **Test Locally:**

   ```bash
   # Create .env.local file
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password

   # Test locally
   npm run dev
   # Visit http://localhost:3000/api/test-email
   ```

### 6. Common Error Messages

- **"Invalid login"** - Wrong username/password or need App Password
- **"Connection timeout"** - Wrong host/port or firewall issue
- **"Authentication failed"** - Need to enable "Less secure app access" or use App Password
- **"Environment variables not set"** - Variables not configured in Vercel

### 7. Gmail Setup Steps

1. Go to Google Account settings
2. Security → 2-Step Verification (enable if not already)
3. Security → App passwords
4. Generate new app password for "Mail"
5. Use the 16-character password as `SMTP_PASS`

### 8. Vercel Environment Variables

Make sure to set environment variables for:

- **Production** environment
- **Preview** environment (optional)
- **Development** environment (for local testing)

### 9. Alternative: Use Resend (Modern Email Service)

If SMTP continues to fail, consider using Resend:

```bash
npm install resend
```

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: "BESTies Party <onboarding@resend.dev>",
  to: [userEmail],
  subject: "Password Reset",
  html: emailHTML,
});
```

Environment variable:

```bash
RESEND_API_KEY=re_your_api_key_here
```
