From node:17-alpine as prod
Run mkdir -p /home/src/backend
COPY . /home/src/backend
WORKDIR /home/src/backend
RUN npm install
CMD ["npm","start"]

From node:17-alpine as test
Run mkdir -p /home/src/backend
COPY . /home/src/backend
WORKDIR /home/src/backend
RUN npm install
RUN npm run test