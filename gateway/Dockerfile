FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package*.json /app/

RUN npm ci --only=production

EXPOSE 3000

CMD ["node", "dist/index.js"]
