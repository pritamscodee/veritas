FROM node:20-alpine

WORKDIR /app

# Prisma's query engine needs OpenSSL on Alpine
RUN apk add --no-cache openssl ca-certificates

COPY package.json package-lock.json ./
COPY shared ./shared
COPY services ./services
COPY frontend ./frontend

RUN npm install
RUN npm run build:shared
RUN npm run build --workspace=services/zk-proof-service

EXPOSE 3003

CMD ["npm", "run", "start", "--workspace=services/zk-proof-service"]
