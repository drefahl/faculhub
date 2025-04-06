FROM node:18-alpine AS base

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

COPY . .

ENV NODE_ENV=production

RUN pnpm run prisma:generate
RUN pnpm run build

EXPOSE 5001

ENV PORT=5001
ENV HOSTNAME="0.0.0.0"
CMD ["node", "dist/src/index.js"]
