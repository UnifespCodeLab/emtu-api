# Use an official Node.js runtime as the base image
FROM node:19
# Yarn is already included in the node:16 image

# Install netcat and postgresql-client
RUN apt-get update && apt-get install -y netcat-openbsd postgresql-client

# Copy the package.json and yarn.lock files to the container
COPY package.json yarn.lock ./

# Install app dependencies
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

# Copy entrypoint script
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose a port (if your Node.js application needs it)
EXPOSE 3000

# Set entrypoint
ENTRYPOINT ["entrypoint.sh"]
