# ==========================
# 1. Base Alpine Image
# ==========================
FROM node:22-alpine AS alpine

# Set pnpm package manager
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm@10.15.1

# ==========================
# 2. Builder Image (Turbo Prune)
# ==========================
FROM alpine AS builder

RUN apk update && apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
# Install turbo globally to prune
RUN npm install -g turbo
COPY . .
# Generate a partial monorepo with only the API app and its dependencies
RUN turbo prune api --docker

# ==========================
# 3. Installer Image (Install & Build)
# ==========================
FROM alpine AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# First install dependencies (as they change less often)
# Copying the lockfile and package.json's from the pruned outcome
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY --from=builder /app/out/full/ .

# Generate Prisma Client (requires DATABASE_URL for config validation)
ENV DATABASE_URL="postgresql://fake"
RUN cd apps/api && npx prisma generate

# Build the project
RUN pnpm turbo run build --filter=api...

# ==========================
# 4. Runner Image (Production)
# ==========================
FROM alpine AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy everything from installer to preserve workspace symlinks and packages
COPY --from=installer --chown=nestjs:nodejs /app ./

# Copy and set entrypoint script
COPY --chown=nestjs:nodejs apps/api/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

USER nestjs

ENV NODE_ENV=production

ENTRYPOINT ["./entrypoint.sh"]
