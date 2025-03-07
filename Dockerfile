# Building image
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# genenv + build
RUN --mount=type=secret,id=REACT_APP_FB_API_KEY \
  --mount=type=secret,id=REACT_APP_FB_AUTH_DOMAIN \
  --mount=type=secret,id=REACT_APP_FB_PROJECT_ID \
  --mount=type=secret,id=REACT_APP_FB_STORAGE_BUCKET \
  --mount=type=secret,id=REACT_APP_FB_MESSAGING_SENDER_ID \
  --mount=type=secret,id=REACT_APP_FB_APP_ID \
  --mount=type=secret,id=REACT_APP_FB_MEASUREMENT_ID \
  REACT_APP_FB_API_KEY=$(cat /run/secrets/REACT_APP_FB_API_KEY) && \
  REACT_APP_FB_AUTH_DOMAIN=$(cat /run/secrets/REACT_APP_FB_AUTH_DOMAIN) && \
  REACT_APP_FB_PROJECT_ID=$(cat /run/secrets/REACT_APP_FB_PROJECT_ID) && \
  REACT_APP_FB_STORAGE_BUCKET=$(cat /run/secrets/REACT_APP_FB_STORAGE_BUCKET) && \
  REACT_APP_FB_MESSAGING_SENDER_ID=$(cat /run/secrets/REACT_APP_FB_MESSAGING_SENDER_ID) && \
  REACT_APP_FB_APP_ID=$(cat /run/secrets/REACT_APP_FB_APP_ID) && \
  REACT_APP_FB_MEASUREMENT_ID=$(cat /run/secrets/REACT_APP_FB_MEASUREMENT_ID) && \
  echo $REACT_APP_FB_STORAGE_BUCKET && \
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
