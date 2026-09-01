FROM node:20-alpine

WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Copy backend source
COPY backend/kanovote-backend .

# Copy entrypoint
COPY backend/kanovote-backend/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENV PORT=3000
EXPOSE 3000

# Use entrypoint to install deps when missing, then run the default command
ENTRYPOINT ["sh", "/usr/local/bin/docker-entrypoint.sh"]
CMD ["npm", "run", "start:dev"]
