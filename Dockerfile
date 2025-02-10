# syntax = docker/dockerfile:1

# Use a Node.js image (fallback to avoid GHCR issue)
FROM node:20-alpine as base

LABEL fly_launch_runtime="NodeJS"

# Set working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Throw-away build stage to reduce size of final image
FROM base as build

# Install necessary system dependencies
RUN apk update && apk add --no-cache python3 pkgconfig build-base

RUN curl -fsSL https://bun.sh/install | bash

# Ensure bun is available in the PATH
ENV PATH="/root/.bun/bin:${PATH}"

# Install dependencies using Bun
COPY --link package.json . 
RUN bun install --production=false

# Copy application code
COPY --link . .

# Build the app (compile TypeScript to JavaScript)
RUN bun build src/index.ts --outdir=dist

# Remove development dependencies
RUN bun prune --production

# Final stage for the app image
FROM base

# Copy built application from build stage
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
CMD ["bun", "run", "dist/index.js"]
