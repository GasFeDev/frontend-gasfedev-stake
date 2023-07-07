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

# Copy static assets to nginx image
COPY --from=builder /app/build /usr/share/nginx/html

# Set environment variables at runtime
ARG REACT_APP_ISPO_CONTRACT_ETH
ARG REACT_APP_STETH_CONTRACT
ARG REACT_APP_ISPO_CONTRACT_POLYGON
ARG REACT_APP_STMATIC_CONTRACT
ARG REACT_APP_ALCHEMY_API_KEY
ARG REACT_APP_PROJECTID_WALLET_CONNECT

ENV REACT_APP_ISPO_CONTRACT_ETH=$REACT_APP_ISPO_CONTRACT_ETH
ENV REACT_APP_STETH_CONTRACT=$REACT_APP_STETH_CONTRACT
ENV REACT_APP_ISPO_CONTRACT_POLYGON=$REACT_APP_ISPO_CONTRACT_POLYGON
ENV REACT_APP_STMATIC_CONTRACT=$REACT_APP_STMATIC_CONTRACT
ENV REACT_APP_ALCHEMY_API_KEY=$REACT_APP_ALCHEMY_API_KEY
ENV REACT_APP_PROJECTID_WALLET_CONNECT=$REACT_APP_PROJECTID_WALLET_CONNECT

ENV PORT 8080
ENV HOST 0.0.0.0
EXPOSE 80
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
