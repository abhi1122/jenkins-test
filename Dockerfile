FROM ubuntu:latest

FROM node:12.18.3 AS ui-build
WORKDIR /usr/src/app
COPY frontend/ ./frontend/
RUN cd frontend && npm install && npm run build

FROM node:12.18.3 AS server-build
WORKDIR /usr/src/app
COPY backend/ ./backend/
RUN cd backend && npm install

EXPOSE 3007

CMD ["npm", "run", "start"]