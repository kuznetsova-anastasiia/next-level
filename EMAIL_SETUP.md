# Email Configuration Setup

To enable email confirmations for submissions, you need to configure SMTP settings in your environment variables.

## Environment Variables

Add these variables to your `.env.local` file:

```env
# Email Configuration (for submission confirmations)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="nextlevel.party.ua@gmail.com"
SMTP_PASS="pava fotv nakx ymnz"
```

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password as `SMTP_PASS`

## Other Email Providers

### Outlook/Hotmail

```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_SECURE="false"
```

### Yahoo

```env
SMTP_HOST="smtp.mail.yahoo.com"
SMTP_PORT="587"
SMTP_SECURE="false"
```

### Custom SMTP

```env
SMTP_HOST="your_smtp_server.com"
SMTP_PORT="587"
SMTP_SECURE="false"
```

## Features

The email confirmation includes:

- ✅ Beautiful HTML template with your brand colors
- ✅ Submission details (number, category, song, participants)
- ✅ Next steps information
- ✅ Contact information (Instagram & Telegram links)
- ✅ Ukrainian language support
- ✅ Mobile-responsive design
- ✅ Professional signature

## Testing

After setting up the environment variables, test by creating a new submission. The user should receive a confirmation email within a few seconds.

## Troubleshooting

- **Authentication failed**: Check your email and app password
- **Connection timeout**: Verify SMTP host and port
- **Emails not sending**: Check server logs for detailed error messages
