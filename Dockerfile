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

COPY --from=builder /app/dist /usr/share/nginx/html

COPY --from=backend-builder /backend /app/backend

RUN apk add --update nodejs npm

COPY nginx.conf /etc/nginx/nginx.conf


COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080

CMD ["/start.sh"]