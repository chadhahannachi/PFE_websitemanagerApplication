FROM node:18-alpine

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ python3-dev

# Set Node.js memory limit
ENV NODE_OPTIONS="--max-old-space-size=4096"

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

# Build the application with increased memory
RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start:prod"]