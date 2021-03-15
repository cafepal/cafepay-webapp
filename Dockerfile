FROM node:14.16.0
WORKDIR /app
COPY package.json .
RUN yarn

COPY . .
RUN npm run build
