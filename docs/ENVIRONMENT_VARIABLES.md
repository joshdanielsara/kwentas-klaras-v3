# Environment Variables Configuration

This document lists all required environment variables for the Kwentas Klaras v3 application to run properly on Vercel.

## Required Environment Variables

### Database Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority` |

### Firebase Admin SDK (Server-side)

These are used for server-side authentication and user management.

| Variable | Description | How to Get |
|----------|-------------|------------|
| `FIREBASE_PROJECT_ID` | Your Firebase project ID | Firebase Console → Project Settings → General |
| `FIREBASE_PRIVATE_KEY` | Firebase Admin private key | Firebase Console → Project Settings → Service Accounts → Generate New Private Key |
| `FIREBASE_CLIENT_EMAIL` | Firebase Admin client email | Firebase Console → Project Settings → Service Accounts → Service Account Email |

**Note:** The `FIREBASE_PRIVATE_KEY` should include the full key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`. When setting in Vercel, you may need to escape newlines or use the full JSON format.

### Firebase Client SDK (Public)

These are exposed to the client-side and used for frontend authentication.

| Variable | Description | How to Get |
|----------|-------------|------------|
| `FIREBASE_API_KEY` | Firebase Web API Key | Firebase Console → Project Settings → General → Your apps → Web app config |
| `FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | Usually `{project-id}.firebaseapp.com` |
| `FIREBASE_PROJECT_ID` | Firebase Project ID | Same as Admin SDK above |
| `FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | Usually `{project-id}.appspot.com` |
| `FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | Firebase Console → Project Settings → Cloud Messaging |
| `FIREBASE_APP_ID` | Firebase App ID | Firebase Console → Project Settings → General → Your apps |
| `FIREBASE_MEASUREMENT_ID` | Firebase Analytics ID (Optional) | Firebase Console → Analytics → Measurement ID |

### Application Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_URL` | Your application URL | `https://kwentas-klaras-v3.vercel.app` |

### Email Configuration (Optional - for Brevo/SendGrid)

| Variable | Description |
|----------|-------------|
| `BREVO_API_KEY` | Brevo API key for sending emails |
| `BREVO_SENDER_EMAIL` | Email address to send from |
| `BREVO_SENDER_NAME` | Name to display as sender |

### Additional Firebase Admin Variables (Optional)

These are used for advanced Firebase Admin operations but may not be required for basic functionality.

| Variable | Description |
|----------|-------------|
| `FIREBASE_PRIVATE_KEY_ID` | Private key ID from service account |
| `FIREBASE_CLIENT_ID` | Client ID from service account |
| `FIREBASE_AUTH_URI` | Auth URI (usually `https://accounts.google.com/o/oauth2/auth`) |
| `FIREBASE_TOKEN_URI` | Token URI (usually `https://oauth2.googleapis.com/token`) |

## Setting Environment Variables in Vercel

### Via Vercel Dashboard

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: Variable name (e.g., `MONGODB_URI`)
   - **Value**: Variable value
   - **Environment**: Select which environments (Production, Preview, Development)
4. Click **Save**

### Via Vercel CLI

```bash
# Set a single variable
vercel env add MONGODB_URI production

# Set multiple variables from a file
vercel env pull .env.production.local
# Edit .env.production.local
vercel env push .env.production.local production
```

### Pulling Environment Variables Locally

```bash
# Pull all environment variables
npx vercel env pull .env.local

# Pull specific environment
npx vercel env pull .env.production.local production
```

## Common Issues and Solutions

### Issue: 500 Error on `/api/projects`

**Cause:** Missing or incorrect `MONGODB_URI`

**Solution:**
1. Verify MongoDB connection string is correct
2. Ensure the database is accessible from Vercel's IP addresses
3. Check MongoDB Atlas network access settings if using Atlas

### Issue: 401 Error on `/api/auth/me` or `/api/auth/login`

**Cause:** Missing or incorrect Firebase Admin SDK credentials

**Solution:**
1. Verify all three Firebase Admin variables are set:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_CLIENT_EMAIL`
2. Ensure `FIREBASE_PRIVATE_KEY` includes the full key with newlines properly escaped
3. Verify the service account has proper permissions in Firebase Console

### Issue: Firebase Client Initialization Fails

**Cause:** Missing or incorrect Firebase Client SDK variables

**Solution:**
1. Verify all Firebase Client variables are set in Vercel
2. Check that `FIREBASE_PROJECT_ID` matches between Admin and Client configs
3. Ensure variables are set for the correct environment (Production/Preview)

### Issue: Environment Variables Not Updating After Deployment

**Solution:**
1. After adding/updating environment variables, you must redeploy:
   ```bash
   npx vercel deploy --prod
   ```
2. Environment variables are baked into the build, so changes require a new deployment

## Verification

After setting environment variables, verify they're working:

1. **Check Database Connection:**
   - Visit `/api/projects` - should return 200 with project list (or empty array)

2. **Check Firebase Admin:**
   - Try logging in - should work if credentials are correct
   - Check Vercel function logs for Firebase initialization errors

3. **Check Firebase Client:**
   - Open browser console - should not see Firebase initialization errors
   - Authentication should work on the frontend

## Security Best Practices

1. **Never commit `.env` files** to Git
2. **Use Vercel's environment variable management** instead of hardcoding
3. **Rotate credentials regularly**, especially if exposed
4. **Use different credentials** for Production and Preview environments
5. **Limit Firebase service account permissions** to only what's needed
6. **Restrict MongoDB access** to Vercel's IP ranges when possible

## Quick Checklist

Before deploying, ensure you have:

- [ ] `MONGODB_URI` set and accessible
- [ ] `FIREBASE_PROJECT_ID` set
- [ ] `FIREBASE_PRIVATE_KEY` set (with proper formatting)
- [ ] `FIREBASE_CLIENT_EMAIL` set
- [ ] `FIREBASE_API_KEY` set
- [ ] `FIREBASE_AUTH_DOMAIN` set
- [ ] `FIREBASE_STORAGE_BUCKET` set
- [ ] `FIREBASE_MESSAGING_SENDER_ID` set
- [ ] `FIREBASE_APP_ID` set
- [ ] `APP_URL` set to your Vercel deployment URL
