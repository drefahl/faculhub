FROM node:18-alpine AS base

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
COPY email/package.json email/pnpm-lock.yaml* ./email/
RUN corepack enable pnpm && pnpm install --recursive --frozen-lockfile

COPY . .

ENV NODE_ENV=production

RUN pnpm run prisma:generate
RUN pnpm run build

EXPOSE 5001

ARG DATABASE_URL
ARG JWT_SECRET
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG GOOGLE_CALLBACK_URI
ARG FRONTEND_URL
ARG RESEND_API_KEY
ARG HASH_SECRET

ENV DATABASE_URL=$DATABASE_URL
ENV JWT_SECRET=$JWT_SECRET
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV GOOGLE_CALLBACK_URI=$GOOGLE_CALLBACK_URI
ENV FRONTEND_URL=$FRONTEND_URL
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV HASH_SECRET=$HASH_SECRET

ENV PORT=5001
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "-c", "echo '📦 Aplicando migrations' && pnpm prisma migrate deploy && echo '🚀 Iniciando API' && node dist/src/index.js"]


