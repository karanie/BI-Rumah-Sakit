FROM alpine AS base
WORKDIR /code
RUN apk add npm
ENV NUXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json .
RUN npm install

FROM base AS dev
WORKDIR /code
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS build
WORKDIR /code
COPY . .
RUN npm run build

FROM build AS production
WORKDIR /code
COPY --from=build /code/.output .
EXPOSE 3000
CMD ["node", "server/index.mjs"]
