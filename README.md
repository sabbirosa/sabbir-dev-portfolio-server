# Sabbir Ahmed Portfolio v2 - Server

A robust Express.js API server with JWT authentication, built with TypeScript and following MVC architecture patterns.

## 🏗️ Architecture

This project follows a clean **Model-View-Controller (MVC)** architecture with proper separation of concerns:

```
src/
├── config/          # Configuration files
├── controllers/     # Business logic (C in MVC)
├── middleware/      # Express middleware
├── models/          # Data models (M in MVC)
├── routes/          # Route definitions (V in MVC)
├── scripts/         # Utility scripts
├── types/           # TypeScript type definitions
├── utils/           # Helper utilities
└── server.ts        # Main server entry point
```

## ✨ Features

- **🔐 JWT Authentication**: Secure token-based authentication
- **🛡️ Security**: Helmet, rate limiting, CORS, request validation
- **📝 Logging**: Comprehensive logging with different levels
- **🗄️ Database Ready**: Extensible to use Prisma, MongoDB, or other databases
- **⚡ Performance**: Compression, request timeouts, and optimization
- **🧪 Error Handling**: Global error handling with proper HTTP status codes
- **📋 Health Checks**: Kubernetes-ready health and readiness probes
- **🔄 Hot Reload**: Development server with auto-restart
- **📊 Monitoring**: Request logging and performance metrics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd sabbir-dev-portfolio-v2-server

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit environment variables
nano .env
```

### Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=3001
HOST=localhost

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# Admin User Configuration
ADMIN_EMAIL=admin@sabbir.dev
ADMIN_PASSWORD=Admin123!

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000

# Logging
LOG_LEVEL=info
```

### Development

```bash
# Start development server with hot reload
npm run dev

# Build the project
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Seed database
npm run seed
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint                | Description                 | Protected |
| ------ | ----------------------- | --------------------------- | --------- |
| POST   | `/api/auth/login`       | User login                  | ❌        |
| GET    | `/api/auth/verify`      | Verify token                | ✅        |
| POST   | `/api/auth/logout`      | User logout                 | ✅        |
| GET    | `/api/auth/profile`     | Get user profile            | ✅        |
| GET    | `/api/auth/credentials` | Demo credentials (dev only) | ❌        |

### Health Checks

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| GET    | `/api/health`       | General health check |
| GET    | `/api/health/ready` | Readiness probe      |
| GET    | `/api/health/live`  | Liveness probe       |

### API Information

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| GET    | `/api`         | API information     |
| GET    | `/api/version` | Version information |

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

### Login Request

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sabbir.dev",
    "password": "Admin123!"
  }'
```

### Login Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "email": "admin@sabbir.dev",
      "role": "admin"
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Using the Token

```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🛡️ Security Features

- **Helmet**: Security headers
- **Rate Limiting**: Prevent brute force attacks
- **CORS**: Cross-origin resource sharing
- **Request Size Limiting**: Prevent large payload attacks
- **Input Validation**: Joi schema validation
- **Error Sanitization**: No sensitive data in error responses
- **JWT Security**: Token expiration and validation

## 📊 Logging

The server includes comprehensive logging:

```typescript
// Different log levels
logger.info("General information");
logger.warn("Warning message");
logger.error("Error occurred");
logger.debug("Debug information");

// Specialized logging
logger.logRequest(method, url, statusCode, responseTime);
logger.logAuth(event, userId, email);
logger.logDatabase(operation, table, duration);
```

## 🗄️ Database Integration

Currently uses in-memory storage for demo purposes. Easy to extend:

```typescript
// src/config/database.ts
export const databaseConfig: DatabaseConfig = {
  type: "prisma", // or 'mongodb'
  connectionString: process.env.DATABASE_URL,
};
```

## 🐳 Docker Support

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/server.js"]
```

## 🧪 Testing

```bash
# Test the API endpoints
curl http://localhost:3001/api/health
curl http://localhost:3001/api/auth/credentials
```

## 📝 Development Guide

### Adding New Routes

1. Create controller in `src/controllers/`
2. Define routes in `src/routes/`
3. Add validation schemas in `src/utils/validation.ts`
4. Update types in `src/types/index.ts`

### Adding Middleware

```typescript
// src/middleware/yourMiddleware.ts
export const yourMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Your logic here
  next();
};
```

### Adding Models

```typescript
// src/models/YourModel.ts
export class YourModel {
  // Model methods
}
```

## 🔧 Configuration

### Environment-specific configs

- **Development**: Hot reload, detailed logging, demo endpoints
- **Production**: Security headers, rate limiting, minimal logging
- **Test**: In-memory database, mock services

### Rate Limiting

```typescript
// General API: 100 requests per 15 minutes
// Auth endpoints: 5 requests per 15 minutes
```

## 📋 Health Monitoring

### Health Check Response

```json
{
  "success": true,
  "message": "Server is running healthy",
  "data": {
    "status": "healthy",
    "uptime": "3600s",
    "environment": "development",
    "memory": {
      "rss": "45MB",
      "heapTotal": "25MB",
      "heapUsed": "15MB"
    }
  }
}
```

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure proper CORS origins
- [ ] Set up database connection
- [ ] Configure logging
- [ ] Set up SSL/TLS
- [ ] Configure reverse proxy
- [ ] Set up monitoring

### Environment Variables (Production)

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=your_production_secret_key_64_chars_minimum
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=StrongPassword123!
FRONTEND_URL=https://yourdomain.com
DATABASE_URL=your_database_connection_string
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:

- Email: admin@sabbir.dev
- GitHub Issues: [Create an issue](https://github.com/sabbir-ahmed/portfolio-v2-server/issues)

---

**Built with ❤️ by Sabbir Ahmed**
