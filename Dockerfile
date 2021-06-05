FROM ghcr.io/nautilusdigital/node:latest

RUN mkdir -p /app
COPY . /app/

WORKDIR /app

RUN yarn
RUN yarn run build
CMD yarn start
# CMD yarn dev

EXPOSE 8080

HEALTHCHECK CMD curl --fail http://localhost:8080 || exit 1