FROM node:22-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@11

WORKDIR /app

COPY . .

RUN pnpm install

RUN pnpm --filter @autosocial/db exec prisma generate

RUN pnpm --filter @autosocial/web build

EXPOSE 8080

ENV NODE_ENV=production
ENV PORT=8080

CMD ["pnpm", "--filter", "@autosocial/web", "start"]
