FROM node:22-alpine

ENV NODE_ENV=production

WORKDIR /app

# Dependencies are installed before the source is copied so that editing a
# command does not invalidate the cached install layer.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY src ./src

# Don't run as root. The image is read-only at runtime; nothing is written.
USER node

# Node is PID 1 here, which means no signal handling comes for free — the
# SIGTERM/SIGINT handlers in src/index.js are what make shutdown graceful.
CMD ["node", "src/index.js"]
