# Use official Node.js image
FROM node:18-alpine

# Set working directory in the container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# curl for health checks
RUN apk add --no-cache curl

# Expose the port for the Next.js app
EXPOSE 3000

# Run Next.js in production mode
CMD ["npm", "run", "dev"]