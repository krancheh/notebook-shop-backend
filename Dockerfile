FROM node
WORKDIR /
COPY package.json .
RUN npm install
COPY . .
CMD [ "node", "./src/index.js" ]