# Stage 1: Build Stage
FROM node:lts-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json first (to optimize caching)
COPY package.json package-lock.json ./

# Install dependencies based on lockfile
RUN npm ci

# Copy the rest of the application source code
COPY ./ ./

# Build the application
RUN npm run build

# Stage 2: Production Stage
FROM nginx:stable-alpine

# Copy Nginx configuration
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy only built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

