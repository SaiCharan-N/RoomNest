FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Leave empty to call the API on the same origin (/api), which nginx proxies to
# the backend. Set it only if the API lives on a different host.
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build


FROM nginx:alpine

# Where nginx forwards /api and /uploads. "backend" is the service name used
# by both docker-compose.yml and the Kubernetes manifests in k8s/.
ENV BACKEND_HOST=backend \
    BACKEND_PORT=5000

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
