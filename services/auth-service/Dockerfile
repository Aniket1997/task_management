FROM node:20-alpine AS builder

WORKDIR /app

# Copy shared utilities
COPY shared/ /app/shared/

# Copy service files and install deps
COPY services/auth-service/package*.json /app/services/auth-service/
WORKDIR /app/services/auth-service
RUN npm ci

COPY services/auth-service/ /app/services/auth-service/

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app/services/auth-service

COPY --from=builder /app/services/auth-service/dist /app/services/auth-service/dist
COPY --from=builder /app/services/auth-service/package*.json /app/services/auth-service/

RUN npm ci --only=production

EXPOSE 3001

CMD ["node", "dist/services/auth-service/src/index.js"]
