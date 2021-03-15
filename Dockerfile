FROM node:14.16.0
WORKDIR /app
COPY . .
RUN yarn
RUN yarn add
RUN npm run build

CMD ["npm", "run", "start"]