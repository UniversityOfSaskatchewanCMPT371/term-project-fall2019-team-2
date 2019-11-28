FROM node:alpine AS build-env

ARG REACT_APP_SENTRY_DSN
ARG REACT_APP_VERSION

WORKDIR /home/node/app

# Bring just the package.json for caching
ADD package.json .

# Install deps
RUN npm install 

# Bring over the source code for building
COPY . .

# Build and ensure lints pass, set environment variables
RUN npm run lint \
    && sed 's/<REACT_APP_SENTRY_DSN>/${REACT_APP_SENTRY_DSN}/g' .env.template > .env \
    && sed -i 's/<REACT_APP_VERSION>/${REACT_APP_VERSION}/g' .env \
    && npm run build

FROM node:alpine
# Production runner, not the most lightweight but it's alright.

RUN npm install -g serve

# Use a user without root permissions
USER node
WORKDIR /app

EXPOSE 5000

# Copy only the relevant build artifacts
COPY --chown=node --from=build-env /home/node/app/build/ .

# Serves by default on port 5000
CMD ["serve", "-s", "/app"]
