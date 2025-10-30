import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Redis } from 'ioredis';

import { InjectRedis } from '@/redis/redis.decorator';

@Injectable()
export class UserCacheService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  private getKey(id: string) {
    return `user:${id}`;
  }

  async invalidate(id: string): Promise<void> {
    await this.redis.del(this.getKey(id));
  }

  async set(id: string, user: User, ttl: number = 60): Promise<void> {
    await this.redis.set(this.getKey(id), JSON.stringify(user), 'EX', ttl);
  }

  async get(id: string): Promise<User | null> {
    const user = await this.redis.get(this.getKey(id));

    return user ? (JSON.parse(user) as User) : null;
  }
}
