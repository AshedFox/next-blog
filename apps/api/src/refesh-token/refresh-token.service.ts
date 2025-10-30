import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RefreshToken } from '@prisma/client';
import { randomBytes } from 'crypto';
import ms, { StringValue } from 'ms';

import { HashService } from '@/hash/hash.service';
import { PrismaService } from '@/prisma/prisma.service';

import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';

@Injectable()
export class RefreshTokenService {
  private refreshTokenLifetime: number;
  private readonly logger = new Logger(RefreshTokenService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
    private readonly configService: ConfigService
  ) {
    this.refreshTokenLifetime = ms(
      this.configService.getOrThrow<StringValue>('REFRESH_TOKEN_LIFETIME')
    );
  }

  async create(input: CreateRefreshTokenDto): Promise<[string, RefreshToken]> {
    const token = randomBytes(32).toString('base64url');

    return [
      token,
      await this.prisma.refreshToken.create({
        data: {
          ...input,
          tokenHash: await this.hashService.hash(token),
          expiresAt: new Date(Date.now() + this.refreshTokenLifetime),
        },
      }),
    ];
  }

  async getOneByToken(token: string): Promise<RefreshToken> {
    const refeshToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: await this.hashService.hash(token), revokedAt: null },
    });

    if (!refeshToken) {
      throw new NotFoundException('Refresh token not found!');
    }

    return refeshToken;
  }

  async rotate(token: string): Promise<[string, RefreshToken]> {
    const revoked = await this.revokeByToken(token);

    return this.create({
      userId: revoked.userId,
      userAgent: revoked.userAgent ?? undefined,
      ip: revoked.ip ?? undefined,
    });
  }

  async revokeByToken(token: string): Promise<RefreshToken> {
    const tokenHash = await this.hashService.hash(token);
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash, revokedAt: null },
    });

    if (!refreshToken) {
      throw new NotFoundException('Refresh token not found!');
    }

    return this.prisma.refreshToken.update({
      where: { tokenHash },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllByUserId(userId: string): Promise<number> {
    const { count } = await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { revokedAt: new Date() },
    });

    return count;
  }

  async deleteByToken(token: string): Promise<RefreshToken> {
    const tokenHash = await this.hashService.hash(token);
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (!refreshToken) {
      throw new NotFoundException('Refresh token not found!');
    }

    return this.prisma.refreshToken.delete({ where: { tokenHash } });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async clearExpired() {
    this.logger.log('Clearing expired refresh tokens...');

    const { count } = await this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lte: new Date() }, revokedAt: null },
    });

    this.logger.log(`Cleared ${count} expired refresh tokens`);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async clearRevoked() {
    this.logger.log('Clearing revoked refresh tokens...');

    const { count } = await this.prisma.refreshToken.deleteMany({
      where: { revokedAt: { not: null } },
    });

    this.logger.log(`Cleared ${count} revoked refresh tokens`);
  }
}
