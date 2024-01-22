FROM node:18-alpine
WORKDIR /srv
COPY package*.json ./
RUN npm install
COPY . .

CMD [ "npm", "run", "serve" ]