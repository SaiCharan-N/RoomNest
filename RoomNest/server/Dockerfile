FROM node:20-alpine

ENV NODE_ENV=production

WORKDIR /app

# Install production dependencies first so this layer is cached
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

# Uploaded room images are written here; mount a volume at this path to keep them
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads

# Run as the unprivileged user that ships with the node image
USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5000/api/health || exit 1

CMD ["node", "server.js"]
