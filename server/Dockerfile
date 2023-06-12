# Specify a base image
FROM node:16.17.0
WORKDIR /usr/src/app

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
RUN npm install

COPY . .


ENV PORT 8080
EXPOSE 8080
CMD [ "npm","run","start-js" ]
