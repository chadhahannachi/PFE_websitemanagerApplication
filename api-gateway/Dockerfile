# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY .env ./

# Expose the port
EXPOSE 3001

# Set environment variables for debugging
ENV NODE_ENV=production
ENV LICENSE_SERVICE_URL=http://license-service:8000
ENV WEBSITE_MANAGER_URL=http://website-manager-backend:5000


# Start the application with more verbose logging
CMD ["node", "dist/main"] 