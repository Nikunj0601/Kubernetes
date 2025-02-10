FROM --platform=linux/amd64 node:21.3.0-alpine3.18

WORKDIR /app/assignment1_2

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
