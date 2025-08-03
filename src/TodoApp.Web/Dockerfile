# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY src/TodoApp.Web/package*.json ./
RUN npm ci --silent

# Copy source code
COPY src/TodoApp.Web/ .

# Build the app
RUN npm run build

# Runtime stage
FROM nginx:alpine AS final
WORKDIR /usr/share/nginx/html

# Remove default nginx static files
RUN rm -rf ./*

# Copy built app from build stage
COPY --from=build /app/dist .

# Copy nginx configuration
COPY src/TodoApp.Web/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]