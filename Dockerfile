FROM node:18-alpine3.15 AS builder

WORKDIR /app


COPY package*.json ./
RUN npm install
COPY . .


RUN npm run build


FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/conf.d/configfile.template


RUN rm -rf /usr/share/nginx/html/*


COPY --from=builder /app/build /usr/share/nginx/html
ENV PORT 8080
ENV HOST 0.0.0.0
EXPOSE 80
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
