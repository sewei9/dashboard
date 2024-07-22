# Stage 1: Build the frontend
FROM node:16-alpine as build-frontend

WORKDIR /app

# Copy frontend dependencies and install
COPY package.json package-lock.json ./
RUN npm install

# Copy frontend source code and build
COPY . .
RUN npm run build

# Stage 2: Setup backend and install dependencies
FROM node:16-alpine as build-backend

WORKDIR /app

# Copy backend dependencies and install
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm install

# Copy backend source code
COPY backend ./backend

# Copy built frontend to the backend public directory
COPY --from=build-frontend /app/dist ./backend/public

# Stage 3: Setup Nginx and run the application
FROM nginx:alpine

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/

# Copy backend build files
COPY --from=build-backend /app/backend /app

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
