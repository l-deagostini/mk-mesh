FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY ./src/shared ../shared
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
CMD ["node", "dist/main"]