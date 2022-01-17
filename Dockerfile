FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3333

ENTRYPOINT [ "node", "ace", "serve" ]
