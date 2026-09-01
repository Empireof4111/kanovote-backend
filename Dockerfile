FROM node:20-alpine

WORKDIR /usr/src/app
ENV PATH=/usr/src/app/node_modules/.bin:$PATH
ENV PORT=3000

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENV NODE_ENV=production
EXPOSE 3000
ENTRYPOINT ["sh", "/usr/local/bin/docker-entrypoint.sh"]
CMD ["npm", "run", "start:prod"]