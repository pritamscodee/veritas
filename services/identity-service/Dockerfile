FROM node:20-alpine
WORKDIR /app
COPY services/identity-service/package.json ./
COPY shared/types/package.json ../shared/types/
COPY shared/constants/package.json ../shared/constants/
COPY shared/stellar/package.json ../shared/stellar/
RUN npm install
COPY services/identity-service/prisma ./prisma
RUN npx prisma generate
COPY services/identity-service/src ./src
COPY shared/types ./../shared/types
COPY shared/constants ./../shared/constants
COPY shared/stellar ./../shared/stellar
RUN npm run build
EXPOSE 3002
CMD ["node", "dist/index.js"]
