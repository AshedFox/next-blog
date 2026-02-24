import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { createHash } from 'crypto';
import { Redis } from 'ioredis';
import SuperJSON from 'superjson';

import { InjectRedis } from '@/redis/redis.decorator';

@Injectable()
export class UserCacheService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  private getSetKey(id: string) {
    return `user:${id}`;
  }

  private getKey(id: string, query?: Record<string, any>) {
    const queryHash = createHash('sha256')
      .update(SuperJSON.stringify(query))
      .digest('hex');
    return `user:${id}${queryHash}`;
  }

  async invalidate(id: string, query?: Record<string, any>): Promise<void> {
    if (query) {
      const key = this.getKey(id, query);
      await this.redis.del(key);
      return;
    }
    const setKey = this.getSetKey(id);
    await this.redis.del([...(await this.redis.smembers(setKey)), setKey]);
  }

  async set(
    id: string,
    user: User,
    query?: Record<string, any>,
    ttl: number = 60
  ): Promise<void> {
    const setKey = this.getSetKey(id);
    const key = this.getKey(id, query);
    await this.redis
      .multi()
      .set(key, SuperJSON.stringify(user), 'EX', ttl)
      .sadd(setKey, key)
      .exec();
  }

  async get(id: string, query?: Record<string, any>): Promise<User | null> {
    const user = await this.redis.get(this.getKey(id, query));

    return user ? SuperJSON.parse<User>(user) : null;
  }
}
