FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install -g nodemon
RUN npm install --only=development

COPY . .

EXPOSE 3000

CMD ["nodemon", "app.ts"]
