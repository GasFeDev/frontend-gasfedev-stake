# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:18-alpine3.15
# Set the working directory to /app inside the container
WORKDIR /app

ENV PORT 8080

COPY ./package.json ./

RUN yarn install
RUN yarn global add ts-node
RUN yarn global add typescript

COPY . .

# Expose the PORT
EXPOSE $PORT
EXPOSE 80
CMD [ "npm", "run", "start" ]
