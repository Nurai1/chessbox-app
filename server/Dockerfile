# Specify a base image
FROM node:16.17.0

#Install some dependencies

WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install

RUN apt-get update
RUN apt-get install zip

# Set up a default command
RUN npm run build
# CMD [ "npm","run","build" ]