FROM node:20-alpine AS builder

WORKDIR /app

# Copy shared utilities
COPY shared/ /app/shared/

# Copy service files and install deps
COPY services/user-service/package*.json /app/services/user-service/
WORKDIR /app/services/user-service
RUN npm ci

COPY services/user-service/ /app/services/user-service/

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app/services/user-service

COPY --from=builder /app/services/user-service/dist /app/services/user-service/dist
COPY --from=builder /app/services/user-service/package*.json /app/services/user-service/

RUN npm ci --only=production

EXPOSE 3002

CMD ["node", "dist/services/user-service/src/index.js"]
