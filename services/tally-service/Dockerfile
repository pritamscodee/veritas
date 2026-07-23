FROM node:20-alpine
WORKDIR /app
COPY services/tally-service/package.json ./
COPY shared/types/package.json ../shared/types/
COPY shared/constants/package.json ../shared/constants/
COPY shared/stellar/package.json ../shared/stellar/
RUN npm install
COPY services/tally-service/prisma ./prisma
RUN npx prisma generate
COPY services/tally-service/src ./src
COPY shared/types ./../shared/types
COPY shared/constants ./../shared/constants
COPY shared/stellar ./../shared/stellar
RUN npm run build
EXPOSE 3004
CMD ["node", "dist/index.js"]
