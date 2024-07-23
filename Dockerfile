# Stage 1: Build React App
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
COPY vite.config.ts ./

RUN npm install

COPY . ./

RUN npm run build

# Stage 2: Serve React App and Run Backend
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --only=prod

# Copy the built React app to the dist directory
COPY --from=builder /app/dist /app/dist

# Copy backend source files and install dependencies
COPY backend ./backend
WORKDIR /app/backend
RUN npm install
RUN npm install --only=dev

# Compile TypeScript to JavaScript
RUN npx tsc

# Copy the assets directory to the appropriate location
COPY --from=builder /app/src/assets /app/dist/assets

# Copy the index.html to the appropriate location
COPY --from=builder /app/index.html /app/dist/index.html

EXPOSE 8080

# Run the compiled server.js
CMD ["node", "dist/server.js"]
