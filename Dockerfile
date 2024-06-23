FROM alpine as build
WORKDIR /code
RUN apk add npm
ENV NUXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:alpine
WORKDIR /code
COPY --from=build /code/.output .
EXPOSE 3000
CMD ["node", "server/index.mjs"]
