import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { HashService } from '@/hash/hash.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UsernameGeneratorService } from '@/username-generator/username-generator.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usernameGenerator: UsernameGeneratorService,
    private readonly hashService: HashService
  ) {}

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

  async findOneById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getOneById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

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

  async findOneByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async getOneByUsername(username: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { username } });

    if (!user) {
      throw new NotFoundException('User with this email not found!');
    }

    return user;
  }

  async update(id: string, input: UpdateUserDto): Promise<User> {
    await this.getOneById(id);

    return this.prisma.user.update({ where: { id }, data: input });
  }

  async softDelete(id: string): Promise<User> {
    await this.getOneById(id);

    return this.prisma.user.softDelete({
      where: { id },
    });
  }

  async restore(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: { not: null } },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return this.prisma.user.restore({ where: { id } });
  }
}
