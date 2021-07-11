FROM node:12.16.2 AS build

RUN yarn global add webpack
RUN yarn global add webpack-cli
RUN yarn global add webpack-dev-server

WORKDIR /usr/src/app

COPY package.json .
COPY tsconfig.json .
COPY yarn.lock .

# Get dependencies
RUN yarn

# Get source and configs
COPY webpack.config.js .
# COPY webpack webpack
COPY index.html .
# COPY src src

EXPOSE 80

ENV NODE_ENV=localdocker
CMD yarn start