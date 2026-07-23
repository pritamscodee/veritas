FROM node:20-alpine
WORKDIR /app
COPY services/zk-proof-service/package.json ./
COPY shared/types/package.json ../shared/types/
COPY shared/constants/package.json ../shared/constants/
RUN npm install
COPY services/zk-proof-service/src ./src
COPY shared/types ./../shared/types
COPY shared/constants ./../shared/constants
RUN npm run build
EXPOSE 3003
CMD ["node", "dist/index.js"]
