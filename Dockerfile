# Stage 1: Build React App (Unchanged)
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
COPY vite.config.ts ./

RUN npm install

COPY . ./

RUN npm run build

# Stage 2: Compile TypeScript Backend
FROM node:18 AS backend-builder

WORKDIR /backend

COPY backend/package*.json ./

RUN npm install

COPY backend/ ./

RUN npx tsc

# Stage 3: Serve React App and Run Backend with Nginx
FROM nginx:alpine

# Copy the built React app to the Nginx serve directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the compiled backend and node_modules
COPY --from=backend-builder /backend /app/backend

# Install Node.js and npm in the final stage to run the backend
RUN apk add --update nodejs npm

# Copy Nginx configuration (assuming you have an nginx.conf prepared)
COPY nginx.conf /etc/nginx/nginx.conf

# Copy a script to start both Nginx and the backend server using pm2
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080

CMD ["/start.sh"]