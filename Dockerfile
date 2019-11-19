FROM node:12.13.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["node", "src/index.js"]