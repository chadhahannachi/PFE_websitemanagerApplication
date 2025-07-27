FROM node:18

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

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