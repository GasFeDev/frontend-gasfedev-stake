# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:18-alpine3.15 AS builder
# Set the working directory to /app inside the container
WORKDIR /app

# Cache npm install
COPY package*.json ./
RUN npm install
COPY . .

# Build static assets
RUN npm run build

# STEP 2 build a small nginx image with static website test
FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/conf.d/configfile.template

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Install env-cmd
RUN npm install -g env-cmd

# Copy .env file
COPY .env .env

# Set environment variables and start Nginx
ENV PORT 8080
ENV HOST 0.0.0.0
CMD sh -c "env-cmd -f .env envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
