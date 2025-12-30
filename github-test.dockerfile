FROM node:20-alpine
WORKDIR /app

# Copy files in same order as GitHub Actions
COPY package*.json ./
COPY package-lock.json ./
COPY . .

# Install dependencies
RUN npm install

# Debug what we have
RUN ls -la node_modules/.bin/ | grep vite && echo "vite found in .bin" || echo "vite NOT found in .bin"
RUN npm exec vite --version && echo "vite works via npm exec" || echo "vite FAILS via npm exec"

# Try build
RUN npm run build