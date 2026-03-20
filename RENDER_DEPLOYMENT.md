# Deployment Guide - Siva Electronics on Render

This guide walks you through deploying your Siva Electronics app with Paytm QR payment integration to Render.

## Prerequisites

1. **GitHub Repository** - Your code must be on GitHub
2. **Render Account** - Create free account at [render.com](https://render.com)
3. **Paytm Credentials** - Your Merchant ID and Key (already provided)

## Step-by-Step Deployment

### Step 1: Prepare Your Repository

Make sure your git repository is clean and all changes are committed:

```bash
# Inside project root
git add .
git commit -m "Add Paytm QR payment integration"
git push origin main
```

### Step 2: Connect Render to GitHub

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Select "Deploy an existing repository"
4. Connect your GitHub repository
5. Select the branch `main`

### Step 3: Configure Backend Service

**Service Details:**
- Name: `siva-electronics-backend`
- Environment: `Node`
- Region: Choose closest to your customers
- Plan: Starter (free ≈$7/month) or Free
- Branch: `main`
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

### Step 4: Set Backend Environment Variables

Click **Advanced** and add these environment variables:

```
NODE_ENV                  production
PAYTM_MERCHANT_ID        oAqfaJ24295935325563
PAYTM_MERCHANT_KEY       WqZs7&tlq7h5Oasn
PAYTM_WEBSITE            DEFAULT
PAYTM_CHANNEL_ID         WEB
PAYTM_INDUSTRY_TYPE      Retail
PAYTM_API_URL            https://securegw.paytm.in/theia/api/v1
PAYTM_PAYMENT_URL        https://securegw.paytm.in/theia/api/v1/showPaymentPage
CALLBACK_URL             https://siva-electronics-backend.onrender.com/api/payment/callback
FRONTEND_URL             https://siva-electronics.onrender.com
```

Replace the URLs with your actual Render domain names (they'll be shown after deployment).

### Step 5: Deploy Backend

Click **Create Web Service** and wait for deployment to complete (2-3 minutes).

Note the backend URL: `https://siva-electronics-backend.onrender.com`

### Step 6: Configure Frontend Service

1. From Render Dashboard, click **New +** → **Static Site**
2. Select same repository
3. Select branch `main`

**Service Details:**
- Name: `siva-electronics`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

### Step 7: Set Frontend Environment Variables

Add in **Advanced**:

```
VITE_API_URL    https://siva-electronics-backend.onrender.com
```

### Step 8: Deploy Frontend

Click **Create Static Site** and wait for deployment.

Note the frontend URL: `https://siva-electronics.onrender.com`

### Step 9: Update Backend URLs

Go back to Backend service settings:

1. Click **Environment**
2. Update these variables with actual URLs:
   ```
   CALLBACK_URL    https://siva-electronics-backend.onrender.com/api/payment/callback
   FRONTEND_URL    https://siva-electronics.onrender.com
   ```
3. Click **Save**
4. The backend will redeploy automatically

## Verification

### Test Backend
```bash
curl https://siva-electronics-backend.onrender.com/health
```

Expected response:
```json
{"status":"OK","message":"Backend is running"}
```

### Test Frontend
Visit: `https://siva-electronics.onrender.com`

Should load your Siva Electronics store.

### Test QR Payment
1. Navigate to cart
2. Click checkout
3. Select QR Payment option
4. QR code should generate and display

## Render.yaml File

Your `render.yaml` automatically deploys both services:

```yaml
services:
  - Backend (Node.js)
  - Frontend (Static Site)
```

Render reads this file and creates services accordingly.

## Important Notes

### Cold Starts
- Free tier services go to sleep after 15 min of inactivity
- First request after sleep takes 30-40 seconds
- Upgrade to Starter plan for always-on service

### CORS Configuration
- Backend allows requests from frontend domain
- Update `FRONTEND_URL` if you change frontend domain

### Payment Verification
- Happens every 2 seconds for 60 seconds
- Uses order ID to verify with Paytm servers
- Requires internet connectivity

## Troubleshooting

### Backend not starting?
```bash
# Check logs in Render dashboard
# Look for npm or Node errors
# Ensure Node version is compatible
```

### QR Code not generating?
- Check Backend URL in VITE_API_URL env var
- Ensure Backend service is running
- Check browser console for CORS errors

### Payment verification failing?
- Verify PAYTM_MERCHANT_ID and PAYTM_MERCHANT_KEY are correct
- Check CALLBACK_URL includes full backend domain
- Ensure both domains use HTTPS

### Deployment stuck?
- Check build logs in Render dashboard
- Ensure package.json is in correct directory
- Verify npm install completes successfully

## Updating Code

Simply push changes to GitHub main branch:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render will automatically redeploy both services.

## Monitor Performance

In Render Dashboard:
- View real-time logs
- Monitor CPU and memory usage
- Check deployment history
- Configure alerts (paid plans)

## Scale When Ready

As your store grows:
1. Upgrade to **Starter plan** ($7/month) for always-on service
2. Add database (PostgreSQL, MongoDB)
3. Move static assets to CDN
4. Set up automatic backups

## Security Checklist

✅ HTTPS enforced (Render default)
✅ Merchant Key in environment variables only
✅ CORS restricted to your domain
✅ No secrets in version control
✅ Payment verification implemented
✅ Checksum validation active

## Support

- **Render Docs**: https://render.com/docs
- **Paytm Integration**: https://business.paytm.com/docs
- **Node.js Issues**: https://nodejs.org/docs

---

**Deployed Successfully!** 🎉 Your Siva Electronics store is now live with Paytm QR payments!
