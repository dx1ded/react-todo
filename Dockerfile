# Building image
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# mount secrets + build
RUN --mount=type=secret,id=env_file,dst=/app/.env.secret \
    cp /app/.env.secret /app/.env && \
    npm run build

# Serving image
FROM nginx:stable-alpine AS serve
WORKDIR /usr/share/nginx/html

COPY --from=builder /app/build .

# Copy the custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup && \
    chown -R appuser:appgroup /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appgroup /var/run/nginx.pid

USER appuser
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
