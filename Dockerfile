# Stage 1: Build the React application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies (use yarn install if you use yarn)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (use yarn build if you use yarn)
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:1.25-alpine
COPY --from=builder /app/build /usr/share/nginx/html
# Expose port 80 (Nginx default port)
EXPOSE 80
# Start Nginx and keep it in the foreground
CMD ["nginx", "-g", "daemon off;"]