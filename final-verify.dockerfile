FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY package-lock.json ./
COPY . .

# Install dependencies
RUN npm install

# Debug PATH and vite
RUN echo "Current PATH: $PATH"
RUN echo "Contents of node_modules/.bin:"
RUN ls node_modules/.bin/ | grep vite || echo "vite NOT found"

# Set PATH to include node_modules/.bin first
RUN export PATH="/app/node_modules/.bin:$PATH"
RUN echo "Updated PATH: $PATH"
RUN which vite || echo "vite NOT found in PATH"
RUN npm run build