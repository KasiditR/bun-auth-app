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
RUN apt-get update -qq && \
    apt-get install -y python-is-python3 pkg-config build-essential

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
