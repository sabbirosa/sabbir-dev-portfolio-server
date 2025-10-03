# Health Check

- GET /health returns { status: 'ok' } with 200
- Liveness: process uptime and memory usage
- Readiness: DB connection status
- Use in monitoring and deployment probes
