# Use an official Node.js runtime as the base image
FROM node:16-bullseye-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update \
  && apt-get install -y --no-install-recommends postgresql-client netcat-openbsd ca-certificates curl dos2unix \
  && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN corepack enable && yarn install --frozen-lockfile

# Copy application code
COPY . .

# Normaliza CRLF/BOM e instala o entrypoint
RUN (dos2unix /app/entrypoint.sh || sed -i 's/\r$//' /app/entrypoint.sh) 2>/dev/null || true \
  && sed -i '1s/^\xEF\xBB\xBF//' /app/entrypoint.sh || true \
  && install -m 0755 /app/entrypoint.sh /usr/local/bin/entrypoint.sh

# Generate Prisma client
RUN npx prisma generate

# Expose a port (if your Node.js application needs it)
EXPOSE 3001 3333

# Set entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
