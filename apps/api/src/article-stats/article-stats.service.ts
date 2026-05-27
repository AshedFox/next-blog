import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import Redis from 'ioredis';

import { PrismaService } from '@/prisma/prisma.service';
import { InjectRedis } from '@/redis/redis.decorator';

@Injectable()
export class ArticleStatsService {
  private readonly logger = new Logger(ArticleStatsService.name);
  private readonly viewsBufferKey = 'articles:views:buffer';
  private readonly processingKey = `${this.viewsBufferKey}:processing`;

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly prisma: PrismaService
  ) {}

  private getCooldownKey(articleId: string, userId?: string, ip?: string) {
    if (userId) {
      return `view:cooldown:${articleId}:${userId}`;
    } else if (ip) {
      return `view:cooldown:${articleId}:${ip}`;
    }

    return undefined;
  }

  async trackView(articleId: string, userId?: string, ip?: string) {
    const cooldownKey = this.getCooldownKey(articleId, userId, ip);

    if (!cooldownKey) {
      return false;
    }
    const isCooldown = await this.redis.exists(cooldownKey);

    if (isCooldown) {
      return false;
    }

    await this.redis.set(cooldownKey, '1', 'EX', 24 * 60 * 60);
    await this.redis.hincrby(this.viewsBufferKey, articleId, 1);

    return true;
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async syncViewsToDatabase() {
    this.logger.log('Starting articles views sync...');

    const lock = await this.redis.set(
      this.processingKey,
      'lock',
      'EX',
      600,
      'NX'
    );

    if (!lock) {
      this.logger.error(
        'Previous sync did not complete or already running, skipping'
      );
      return;
    }

    try {
      await this.redis.rename(this.viewsBufferKey, this.processingKey);
    } catch {
      await this.redis.del(this.processingKey);
      this.logger.log('No articles views to sync');
      return;
    }

    const buffer = await this.redis.hgetall(this.processingKey);
    const articlesIds = Object.keys(buffer);

    try {
      const CHUNK_SIZE = 500;

      for (let i = 0; i < articlesIds.length; i += CHUNK_SIZE) {
        const chunk = articlesIds.slice(i, i + CHUNK_SIZE);
        await this.prisma.$executeRaw`
          INSERT INTO article_stats (article_id, views_count)
          VALUES ${Prisma.join(
            chunk.map((id) => Prisma.sql`(${id}::uuid, ${Number(buffer[id])})`)
          )}
          ON CONFLICT (article_id)
          DO UPDATE SET
            views_count = article_stats.views_count + EXCLUDED.views_count,
            updated_at = NOW()
        `;
      }

      await this.redis.del(this.processingKey);
      this.logger.log('Successfully synced articles views');
    } catch (error) {
      this.logger.error('Failed to sync articles views', error);
    }
  }
}
