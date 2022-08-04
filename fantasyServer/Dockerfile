FROM node:14.18-slim As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install --only=development

COPY . .

RUN yarn run build

FROM node:14.18-slim as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install --only=production

ENV INFURA_KEY=ad333fcea3014b7e9d16dd770b6ada94

ENV MONGO_URI=mongodb+srv://root:Doko123@cluster0.yhwvf.mongodb.net/contract-service?retryWrites=true&w=majority

ENV GCP_PROJECT_ID=wallettracker-328605

ENV OPEN_SEA_API_KEY=ec933782857645ddb93ed98cec5f4d93

ENV PORT=8080

ENV DCL_STATS_URL=https://cdn-data.decentraland.org

COPY . .

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 8080

CMD ["yarn", "start:prod"]