#stage 1
FROM node:latest as build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

#stage 2
FROM nginx:alpine
COPY --from=build /app/dist/tahrirgoh /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
