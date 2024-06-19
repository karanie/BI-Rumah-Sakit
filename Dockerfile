FROM alpine
WORKDIR /code
COPY . .
RUN apk add npm
ENV NUXT_TELEMETRY_DISABLED=1
RUN npm run build
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
