FROM oven/bun:1
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY . .

USER bun
ENTRYPOINT ["bun", "run", "src/main.ts"]
