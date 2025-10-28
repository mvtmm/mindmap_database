# Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install
COPY . .
ARG VITE_APP_BASE_PATH
ARG VITE_DIRECTUS_URL
ENV VITE_APP_BASE_PATH=${VITE_APP_BASE_PATH}
ENV VITE_DIRECTUS_URL=${VITE_DIRECTUS_URL}
RUN npm run build

# Runner
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
