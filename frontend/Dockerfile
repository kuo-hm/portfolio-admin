# Use Node.js LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy .env file first
COPY .env* ./

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose the port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"] 