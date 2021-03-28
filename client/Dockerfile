FROM node:14.1-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json .

RUN npm install --legacy-peer-deps

CMD ["npm", "start"]

EXPOSE 8000