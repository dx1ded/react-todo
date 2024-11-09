# Building image
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Setting the base url as /react-todo
ENV REACT_APP_BASE_URL=/react-todo

RUN npm run build

# Serving image
FROM node:22-alpine

RUN npm install -g serve

# As it's a new node image we need to copy the build result from the other node image (the one that was used for building)
COPY --from=builder /app/build /app/build

EXPOSE 3000
CMD ["serve", "-s", "build"]
