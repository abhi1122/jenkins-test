FROM node:12.18.3

WORKDIR /usr/src/app/frontend

COPY package*.json ./

RUN npm install

EXPOSE 3008

CMD ["npm", "start"]