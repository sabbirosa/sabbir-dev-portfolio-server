# Vercel Deployment Guide

This guide will help you deploy the Sabbir Ahmed Portfolio v2 Server to Vercel.

## 🚀 Quick Deploy

### Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. MongoDB Atlas account (or another MongoDB hosting service)
3. Your repository pushed to GitHub, GitLab, or Bitbucket

### Step 1: Prepare MongoDB

1. Create a MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier is sufficient for testing)
3. Create a database user with read/write permissions
4. Get your connection string (it should look like: `mongodb+srv://username:password@cluster.mongodb.net/portfolio`)
5. Whitelist Vercel's IP addresses or use `0.0.0.0/0` (all IPs) for simplicity

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Select the `sabbir-dev-portfolio-v2-server` directory as the root
5. Configure the following settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to the server directory
cd sabbir-dev-portfolio-v2-server

# Deploy
vercel
```

### Step 3: Configure Environment Variables

In your Vercel project dashboard, go to **Settings → Environment Variables** and add the following:

| Variable               | Value                                   | Example                                                 |
| ---------------------- | --------------------------------------- | ------------------------------------------------------- |
| `NODE_ENV`             | `production`                            | `production`                                            |
| `MONGODB_URI`          | Your MongoDB connection string          | `mongodb+srv://user:pass@cluster.mongodb.net/portfolio` |
| `JWT_SECRET`           | A strong random string (32+ characters) | Use a password generator                                |
| `JWT_EXPIRES_IN`       | Token expiration time                   | `7d`                                                    |
| `ADMIN_EMAIL`          | Admin user email                        | `admin@sabbir.dev`                                      |
| `ADMIN_PASSWORD`       | Admin user password                     | Use a strong password                                   |
| `FRONTEND_URL`         | Your frontend URL                       | `https://yourapp.vercel.app`                            |
| `RATE_LIMIT_MAX`       | Max requests per window                 | `100`                                                   |
| `RATE_LIMIT_WINDOW_MS` | Time window in milliseconds             | `900000`                                                |
| `LOG_LEVEL`            | Logging level                           | `info`                                                  |
| `PORT`                 | Server port (optional)                  | `3001`                                                  |
| `HOST`                 | Server host (optional)                  | `0.0.0.0`                                               |

**Important**: Make sure to mark these variables for the **Production**, **Preview**, and **Development** environments as needed.

### Step 4: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**

Or trigger a redeploy by pushing a new commit to your repository.

## 🔍 Verify Deployment

Once deployed, verify your API is working:

1. Visit your Vercel deployment URL (e.g., `https://your-project.vercel.app`)
2. You should see a JSON response:

   ```json
   {
     "success": true,
     "message": "Sabbir Ahmed Portfolio API v2 is running",
     "timestamp": "2024-10-04T...",
     "environment": "production"
   }
   ```

3. Check the health endpoint: `https://your-project.vercel.app/api/health`
4. Test authentication: `https://your-project.vercel.app/api/auth/login`

## 🐛 Common Issues

### Issue 1: "FUNCTION_INVOCATION_FAILED"

**Problem**: The serverless function crashes with a 500 error.

**Solutions**:

- Check that all environment variables are set correctly
- Verify your MongoDB connection string is valid
- Check Vercel logs: `vercel logs` or in the dashboard under "Deployments → View Function Logs"
- Ensure your MongoDB cluster allows connections from all IPs (`0.0.0.0/0`)

### Issue 2: "Database Connection Timeout"

**Problem**: Requests timeout when connecting to MongoDB.

**Solutions**:

- Verify MongoDB Atlas network access settings
- Add `0.0.0.0/0` to the IP whitelist in MongoDB Atlas
- Check that your connection string is correct
- Ensure your MongoDB cluster is running

### Issue 3: "CORS Errors"

**Problem**: Frontend cannot connect to the API due to CORS errors.

**Solutions**:

- Make sure `FRONTEND_URL` environment variable is set to your frontend URL
- For multiple frontend URLs, update the CORS configuration in `src/server.ts`
- Check that the frontend is using the correct API URL

### Issue 4: "Rate Limit Exceeded"

**Problem**: Too many requests causing 429 errors.

**Solutions**:

- Adjust `RATE_LIMIT_MAX` and `RATE_LIMIT_WINDOW_MS` environment variables
- Consider implementing different rate limits for authenticated vs. public routes
- For development, rate limiting is disabled by default

## 📊 Monitoring

### View Logs

```bash
# View recent logs
vercel logs

# View logs for a specific deployment
vercel logs [deployment-url]

# Stream logs in real-time
vercel logs --follow
```

### Performance Monitoring

1. Go to your Vercel dashboard
2. Click on your project
3. Navigate to **Analytics** to see:
   - Request counts
   - Response times
   - Error rates
   - Geographic distribution

## 🔐 Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong JWT secrets** (32+ random characters)
3. **Use strong admin passwords** (12+ characters with mixed case, numbers, symbols)
4. **Regularly rotate secrets** (especially JWT_SECRET)
5. **Monitor access logs** for suspicious activity
6. **Keep dependencies updated** (`npm audit` and `npm update`)
7. **Use environment-specific variables** in Vercel

## 🔄 Continuous Deployment

Vercel automatically deploys:

- **Production**: When you push to your main/master branch
- **Preview**: When you create a pull request or push to other branches

To disable automatic deployments:

1. Go to **Settings → Git**
2. Configure deployment branches

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Node.js Runtime](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

## 🆘 Getting Help

If you encounter issues:

1. Check [Vercel's documentation](https://vercel.com/docs)
2. Check [MongoDB Atlas documentation](https://docs.atlas.mongodb.com/)
3. Review the [project's README.md](../README.md)
4. Open an issue in the repository

## 🎉 Success!

Your API should now be deployed and running on Vercel! Update your frontend to point to the new API URL and start using your production backend.
