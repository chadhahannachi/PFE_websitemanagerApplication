# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Set Node.js memory limit to prevent heap out of memory
# ENV NODE_OPTIONS="--max-old-space-size=16384"

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source files
COPY . .

# Set environment variables
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV NODE_ENV=production
ENV NODE_PATH=${NODE_PATH}


# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for HTTP
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]