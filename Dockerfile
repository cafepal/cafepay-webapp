FROM node
Run npm install -g npm@7.6.3

COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "run", "start"]