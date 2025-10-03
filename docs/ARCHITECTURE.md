# Backend Architecture

- Runtime: Node.js + Express
- Language: TypeScript
- ORM: Mongoose
- Auth: JWT with refresh tokens, HttpOnly cookies
- Validation: Zod/Joi-like schema in utils/validation.ts
- Logging: Winston-based logger

## Structure
- src/server.ts: app bootstrap
- src/routes: route modules
- src/controllers: business logic
- src/models: Mongoose models
- src/middleware: auth/security/error handling
- src/utils: helpers, jwt, logger, validation
