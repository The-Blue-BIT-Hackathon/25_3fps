FROM node:alpine as prod
Run mkdir -p /home/src/frontend
COPY . /home/src/frontend
WORKDIR /home/src/frontend
RUN yarn install
RUN yarn build
CMD ["yarn","serve","build"]

FROM node:alpine as test
Run mkdir -p /home/src/frontend
COPY . /home/src/frontend
WORKDIR /home/src/frontend
RUN yarn install
RUN yarn run test a --clearCache
