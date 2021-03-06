# set the base image to Ubuntu
# https://hub.docker.com/_/ubuntu/
FROM ubuntu:latest

# replace shell with bash
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# update the repository sources list
# and install dependencies
RUN apt-get update \
    && apt-get install -y curl \
    && apt-get -y autoclean

# nvm environment variables
RUN mkdir /usr/local/nvm
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 10.16.3

# install nvm
# https://github.com/creationix/nvm#install-script
RUN curl --silent -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash

# install node and npm
RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# add node and npm to path so the commands are available
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# confirm installation
RUN node -v
RUN npm -v

# Create app directory
RUN mkdir /usr/local/csv-app
WORKDIR /usr/local/csv-app

# Install app dependencies
COPY package.json ./
RUN npm install

# Install serve
RUN npm install -g serve
RUN apt-get -y install xsel

# Bundle app source
COPY . .
RUN npm test
RUN npm run build

# serve at port 80
CMD ["serve", "-p", "80", "-s", "build", "-n"]