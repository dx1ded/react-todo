# Building image
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Setting the base url as /react-pizza
ENV VITE_BASE_URL=/react-pizza

RUN npm run build

# Serving image
FROM node:22-alpine
WORKDIR /app

RUN npm install -g serve

# As it's a new node image we need to copy the build result from the other node image (the one that was used for building)
COPY --from=builder /app/dist /app/dist

EXPOSE 80
CMD ["serve", "-s", "dist", "-l", "80"]

