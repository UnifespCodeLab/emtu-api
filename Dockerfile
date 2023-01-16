
# Build dependencies
FROM node:18-alpine as dependencies

ENV NODE_ENV production

WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY . . 
# Build production image
FROM dependencies as builder
RUN npm run build
EXPOSE $PORT
CMD npm run start