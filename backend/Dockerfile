FROM node:latest

WORKDIR /usr/src/app/backend

COPY package*.json ./

RUN npm install

COPY . ./backend/

EXPOSE 3007

CMD ["npm", "run", "start"]