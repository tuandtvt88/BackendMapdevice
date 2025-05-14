FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

# Cài ping
RUN apt-get update && apt-get install -y iputils-ping
RUN apt-get update && apt-get install -y iputils-ping net-tools

COPY . .

CMD ["node", "server.js"]
