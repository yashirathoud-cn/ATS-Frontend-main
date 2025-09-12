FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json .

# Install dependencies
RUN npm install --legacy-peer-deps && npm cache clean --force

# Copy the rest of the application
COPY . .

# Expose port for Vite
EXPOSE 3000

# Build the application
RUN npm run build

# Start the application
CMD ["npm", "run", "dev"]
