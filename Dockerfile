FROM node:18-alpine as BUILD_STAGE

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:18-alpine as PROD_STAGE

WORKDIR /app

COPY --from=BUILD_STAGE /app .

EXPOSE 3000

CMD [ "node", "build" ]
