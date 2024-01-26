FROM node:20-alpine as BUILD_STAGE

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i

COPY . .

RUN npm run build

FROM node:20-alpine as PROD_STAGE

WORKDIR /app

COPY --from=BUILD_STAGE /app .

EXPOSE 3000

CMD [ "node", "build" ]
