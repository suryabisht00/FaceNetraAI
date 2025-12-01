# Mobile Testing with ngrok

This guide explains how to test the application on mobile devices using ngrok.

## The SSL Issue

When accessing your Next.js app via ngrok's HTTPS URL, internal API calls (server-to-server) can fail with SSL errors because:
- External requests come in via HTTPS (ngrok)
- Internal API calls try to use the same HTTPS URL
- But localhost doesn't have SSL configured

## Solution Implemented

The application now uses `INTERNAL_API_URL` environment variable to ensure internal API calls always use HTTP to localhost, regardless of how the app is accessed externally.

## Setup Instructions

### 1. Start Your Development Server
```bash
npm run dev
# or
yarn dev
```

Your app will run on `http://localhost:3000`

### 2. Start ngrok
```bash
ngrok http 3000
```

You'll get an output like:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

### 3. Access on Mobile

Use the ngrok HTTPS URL on your mobile device:
```
https://abc123.ngrok.io
```

## Environment Variables

Make sure these are set in your `.env.local`:

```env
# Internal API calls (always use localhost to avoid SSL issues)
INTERNAL_API_URL=http://localhost:3000

# Face Recognition API
FACE_RECOGNITION_API_URL=http://your-face-api-url

# Liveness API
NEXT_PUBLIC_LIVENESS_API_URL=http://localhost:5000
```

## Testing Checklist

- ✅ Face verification works on mobile
- ✅ Image upload to Cloudinary works
- ✅ Authentication flow completes
- ✅ No SSL errors in console
- ✅ Posts can be created and viewed
- ✅ Real-time features work

## Common Issues

### Issue: SSL Packet Length Too Long
**Error:** `ERR_SSL_PACKET_LENGTH_TOO_LONG`

**Cause:** Internal API calls trying to use HTTPS to localhost

**Solution:** Already fixed! The app now uses `INTERNAL_API_URL=http://localhost:3000`

### Issue: ngrok Connection Refused
**Cause:** Next.js dev server not running

**Solution:** Start your dev server first, then ngrok

### Issue: Camera Not Working on Mobile
**Cause:** Browsers require HTTPS for camera access

**Solution:** Use ngrok's HTTPS URL (not HTTP)

## Production Considerations

For production deployment:

1. Update `INTERNAL_API_URL` to your production domain
2. Ensure all services support HTTPS
3. Configure proper SSL certificates
4. Use environment-specific URLs

Example production `.env`:
```env
INTERNAL_API_URL=https://your-production-domain.com
NEXT_PUBLIC_LIVENESS_API_URL=https://api.your-domain.com
```

## Troubleshooting

### Check Environment Variables
```bash
# In your terminal
echo $INTERNAL_API_URL
```

### Check Logs
Look for these log messages:
- 🔐 Authenticating user with vectorId
- ✅ Authentication successful
- ❌ Authentication API call failed

### Network Tab
In browser DevTools:
1. Open Network tab
2. Filter for `/api/` calls
3. Check if internal calls are using HTTP (not HTTPS)

## ngrok Tips

### Custom Subdomain (Paid)
```bash
ngrok http 3000 --subdomain=your-app-name
```

### Inspect Traffic
Visit `http://localhost:4040` while ngrok is running to see all requests

### Keep Session Alive
Free ngrok sessions expire after 2 hours. Restart ngrok to get a new URL.
