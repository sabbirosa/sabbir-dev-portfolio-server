# Environment Configuration

## Setup

1. Copy `.env.example` to `.env`
2. Update the values according to your environment

## Required Variables

### Server Configuration

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3001)
- `HOST` - Server host (default: localhost)

### Database

- `MONGODB_URI` - MongoDB connection string

### JWT Authentication

- `JWT_SECRET` - Secret key for JWT token signing (must be strong in production)
- `JWT_EXPIRES_IN` - Token expiration time (e.g., 7d, 24h)

### Admin Account

- `ADMIN_EMAIL` - Admin user email
- `ADMIN_PASSWORD` - Admin user password

### CORS & Frontend

- `FRONTEND_URL` - Frontend URL for CORS configuration

### Rate Limiting

- `RATE_LIMIT_MAX` - Maximum requests per window (default: 100)
- `RATE_LIMIT_WINDOW_MS` - Time window in milliseconds (default: 900000 = 15 minutes)

### Logging

- `LOG_LEVEL` - Logging level (info, debug, warn, error)

### Cloudinary (Image Uploads)

- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

Get Cloudinary credentials from: https://cloudinary.com/console

## Files

- `.env.example` - Template with all required variables
- `.env` - Your local environment file (not committed to git)
- Use dotenv in development only
