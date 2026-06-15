FROM node:22-alpine

RUN npm install -g pnpm@11

WORKDIR /app

COPY . .

RUN pnpm install

RUN pnpm --filter @autosocial/db exec prisma generate

RUN pnpm --filter @autosocial/web build

EXPOSE 3000

ENV NODE_ENV=production

CMD ["pnpm", "--filter", "@autosocial/web", "start"]
