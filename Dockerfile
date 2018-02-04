# This is a machine for static serving + saving data through forms

FROM node:carbon

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

# Copy static files
COPY index.js .
COPY app.js .
COPY fileManagement.js .

COPY static ./static/

ENV NODEJS_APP_PORT 80

EXPOSE 80

VOLUME ["/usr/src/data"]
ENV STORE_PATH "/usr/src/data"

CMD ["npm", "start"]
