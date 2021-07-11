FROM node:12.16.2 AS build
# WORKDIR /srv

RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# # Install Yarn
# RUN apt-get update && apt-get install -y apt-transport-https ca-certificates
# RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
# RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
# RUN apt update && apt install -y yarn

# # Install TypeScript & Webpack
# RUN npm install typescript@3.8.3 webpack@4.42.0 webpack-cli@3.3.11  -g



# Copy configs
COPY package.json .
COPY tsconfig.json .
# COPY .npmrc .

# Install dependencies
COPY yarn.lock .
RUN yarn

# Get source and configs
COPY webpack.config.js .
COPY webpack webpack
COPY index.html .
COPY src src

# COPY . /usr/src/app

# Build
# ARG NODE_ENV
# ENV NODE_ENV=$NODE_ENV
RUN webpack --config webpack.config.js --env env=prod




# Runtime image
FROM nginx:alpine

# COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

# Get app dist and copy to nginx server directory
#COPY --from=build /srv/dist /app
COPY --from=build /usr/src/app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
