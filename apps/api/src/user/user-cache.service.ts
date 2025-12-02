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
    const userString = await this.redis.get(this.getKey(id));
    const user = userString ? (JSON.parse(userString) as User) : null;

    if (user) {
      user.createdAt = new Date(user.createdAt);
      user.updatedAt = new Date(user.updatedAt);
    }

    return user;
  }
}
