##Build stage
FROM node:20.11.1 as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install  --force

COPY . .

RUN npm run build --prod

##Setup a server (nginx: a powerful open source server, reverse proxy server, load-balancer and http cache)
#Originally developed to solve the C10K problem (handeling 10,000 simultaneous connections). It serves static files extremely well
FROM nginx:alpine

#create nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

#copy the build resources to nginx html location in order to be served
COPY --from=build-stage /app/dist/skote /usr/share/nginx/html

EXPOSE 80