# stage: dependencies
FROM node:16 AS dependencies

WORKDIR /app/

COPY package.json yarn.lock /app/
RUN yarn install

# stage: builder
FROM dependencies AS builder
COPY ./ /app/
RUN yarn build

# stage: prod
FROM nginx:latest AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build/ /usr/share/nginx/html/

# stage: dev
FROM dependencies AS dev
COPY ./ /app/
CMD PORT=80 yarn start
