# Multi-stage build para Sling Hockey

# Stage 1: Build types
FROM node:18-alpine AS types-builder
WORKDIR /app/types
COPY types/package*.json ./
RUN npm ci
COPY types ./
RUN npm run build

# Stage 2: Build client
FROM node:18-alpine AS client-builder
WORKDIR /app

# Copy types
COPY --from=types-builder /app/types /app/types

# Build client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client ./
RUN npm run build

# Stage 3: Build server
FROM node:18-alpine AS server-builder
WORKDIR /app

# Copy types
COPY --from=types-builder /app/types /app/types

# Build server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server ./
RUN npm run build

# Stage 4: Production
FROM node:18-alpine
WORKDIR /app

# Install production dependencies only
COPY server/package*.json ./
RUN npm ci --only=production

# Copy built artifacts
COPY --from=server-builder /app/server/dist ./dist
COPY --from=client-builder /app/client/dist ./client/dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3001

CMD ["node", "dist/index.js"]