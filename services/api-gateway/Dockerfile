FROM node:20-alpine
WORKDIR /app
COPY services/api-gateway/package.json ./
COPY shared/types/package.json ../shared/types/
COPY shared/constants/package.json ../shared/constants/
RUN npm install
COPY services/api-gateway/src ./src
COPY services/api-gateway/tsconfig.json ./
COPY shared/types ./../shared/types
COPY shared/constants ./../shared/constants
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/index.js"]
