# syntax=docker/dockerfile:1.7

FROM node:20-slim AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build && mkdir -p public/uploads


FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy standalone build output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/data.json ./data.json

# Ensure upload dir exists and is writable
RUN mkdir -p /app/public/uploads && chown -R node:node /app
USER node

EXPOSE 3000
CMD ["node", "server.js"]

