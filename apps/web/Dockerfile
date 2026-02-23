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
WORKDIR /app
RUN npm install -g turbo
COPY . .
# Prune the workspace for the web app
RUN turbo prune web --docker

# ==========================
# 3. Installer Image (Install & Build)
# ==========================
FROM alpine AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies using the pruned workspace
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

RUN pnpm install --frozen-lockfile

# Copy source code
COPY --from=builder /app/out/full/ .

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
ARG BACKEND_INTERNAL_URL
ENV BACKEND_INTERNAL_URL=${BACKEND_INTERNAL_URL}
RUN pnpm turbo run build --filter=web...

# ==========================
# 4. Runner Image (Production)
# ==========================
FROM alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set proper permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy the standalone output
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Copy the actual build assets
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

# Start the standalone server
CMD ["node", "apps/web/server.js"]
