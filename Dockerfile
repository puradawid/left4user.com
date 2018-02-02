# This is a machine for static serving + saving data through forms

FROM node:carbon

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Copy static files
COPY index.js .
COPY static ./static/

ENV NODEJS_APP_PORT 80

EXPOSE 80

CMD ["npm", "start"]
