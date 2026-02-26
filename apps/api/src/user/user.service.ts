import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import type { UserInclude } from '@workspace/contracts';

import { HashService } from '@/hash/hash.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UsernameGeneratorService } from '@/username-generator/username-generator.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserGetOneDto } from './dto/user-get-one.dto';
import { UserCacheService } from './user-cache.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usernameGenerator: UsernameGeneratorService,
    private readonly hashService: HashService,
    private readonly cache: UserCacheService
  ) {}

  private mapInclude(
    include: UserInclude[],
    articlesLimit: number,
    commentsLimit: number,
    listsLimit: number
  ): Prisma.UserInclude {
    return {
      _count: {
        select: {
          articles: include?.includes('articlesCount'),
          comments: include?.includes('commentsCount'),
          lists: include?.includes('listsCount'),
        },
      },
      articles: include?.includes('articles') && { take: articlesLimit },
      comments: include?.includes('comments') && { take: commentsLimit },
      lists: include?.includes('lists') && { take: listsLimit },
    };
  }

  async create({ password, ...input }: CreateUserDto): Promise<User> {
    const maxAttempts = 3;
    const passwordHash = await this.hashService.hash(password);

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const username = this.usernameGenerator.generateUsername();

        return await this.prisma.user.create({
          data: {
            ...input,
            passwordHash,
            username,
            status: 'ACTIVE',
            name: username
              .split('-')
              .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
              .join(' '),
          },
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            const target = error.meta?.target as string[] | undefined;
            if (target?.includes('email')) {
              throw new ConflictException(
                'User with this email already exists!'
              );
            } else if (
              target?.includes('username') &&
              attempt === maxAttempts - 1
            ) {
              throw new InternalServerErrorException(
                'Failed to generate unique username'
              );
            }
            continue;
          }
        }
        throw error;
      }
    }

    throw new InternalServerErrorException(
      'Impossible happended, unable to create user'
    );
  }

  async findOneById(
    id: string,
    useCache: boolean = true,
    query?: UserGetOneDto
  ): Promise<User | null> {
    if (useCache) {
      const cached = await this.cache.get(id, query);

      if (cached) {
        return cached;
      }
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      include:
        query?.include &&
        this.mapInclude(
          query.include,
          query.articlesLimit,
          query.commentsLimit,
          query.listsLimit
        ),
    });

    if (user) {
      await this.cache.set(id, user, query);
    }

    return user;
  }

  async getOneById(
    id: string,
    useCache: boolean = true,
    query?: UserGetOneDto
  ): Promise<User> {
    const user = await this.findOneById(id, useCache, query);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getOneByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('User with this email not found!');
    }

    return user;
  }

  async findOneByUsername(
    username: string,
    query?: UserGetOneDto
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include:
        query?.include &&
        this.mapInclude(
          query.include,
          query.articlesLimit,
          query.commentsLimit,
          query.listsLimit
        ),
    });

    if (user) {
      await this.cache.set(user.id, user, query);
    }

    return user;
  }

  async getOneByUsername(
    username: string,
    query?: UserGetOneDto
  ): Promise<User> {
    const user = await this.findOneByUsername(username, query);

    if (!user) {
      throw new NotFoundException('User with this username not found!');
    }

    return user;
  }

  async update(id: string, input: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.update({ where: { id }, data: input });

    await this.cache.invalidate(id);

    return user;
  }

  async softDelete(id: string): Promise<User> {
    const user = await this.prisma.user.softDelete({
      where: { id },
    });

    await this.cache.invalidate(id);

    return user;
  }

  async restore(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: { not: null } },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const restored = await this.prisma.user.restore({ where: { id } });

    await this.cache.invalidate(id);

    return restored;
  }
}
