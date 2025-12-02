import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { AuthResponseInDto } from '@workspace/contracts';
import Redis from 'ioredis';
import ms, { StringValue } from 'ms';
import SuperJSON from 'superjson';
import { setTimeout } from 'timers/promises';

import { InjectRedis } from '@/redis/redis.decorator';
import { RefreshTokenService } from '@/refesh-token/refresh-token.service';
import { UserService } from '@/user/user.service';

import { HashService } from '../hash/hash.service';
import { AuthMetadataDto } from './dto/auth-metadata.dto';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  private readonly accessTokenExpiresIn: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly refreshTokenService: RefreshTokenService,
    @InjectRedis()
    private readonly redis: Redis
  ) {
    this.accessTokenExpiresIn = ms(
      this.configService.getOrThrow<StringValue>('ACCESS_TOKEN_LIFETIME')
    );
  }

  async signUp(
    { email, password }: SignUpDto,
    metadata?: AuthMetadataDto
  ): Promise<AuthResponseInDto> {
    return this.makeAuthResult(
      await this.userService.create({ email, password }),
      metadata
    );
  }

  async login(
    { email, password }: LoginDto,
    metadata?: AuthMetadataDto
  ): Promise<AuthResponseInDto> {
    try {
      const user = await this.userService.getOneByEmail(email);
      const passwordMatches = await this.hashService.verify(
        user.passwordHash,
        password
      );

      if (!passwordMatches) {
        throw new UnauthorizedException('Failed to login');
      }

      return this.makeAuthResult(user, metadata);
    } catch {
      throw new UnauthorizedException('Failed to login');
    }
  }

  async makeAuthResult(
    user: User,
    metadata?: AuthMetadataDto
  ): Promise<AuthResponseInDto> {
    const [accessToken, [refreshToken, { expiresAt: refreshTokenExpiresAt }]] =
      await Promise.all([
        this.generateAccessToken(user.id),
        this.refreshTokenService.create({
          ...metadata,
          userId: user.id,
        }),
      ]);

    return {
      tokenType: 'Bearer',
      accessTokenExpiresAt: new Date(Date.now() + this.accessTokenExpiresIn),
      accessToken,
      refreshToken,
      refreshTokenExpiresAt,
      user,
    };
  }

  async generateAccessToken(userId: string): Promise<string> {
    return this.jwtService.signAsync({ sub: userId });
  }

  async refresh(oldRefreshToken: string): Promise<AuthResponseInDto> {
    const tokenHash = this.refreshTokenService.getTokenHash(oldRefreshToken);

    const LOCK_KEY = `refresh:lock:${tokenHash}`;
    const LOCK_TTL_MS = 5000;
    const RESULT_KEY = `refresh:result:${tokenHash}`;
    const RESULT_TTL_MS = 15000;
    const RETRY_DELAY_MS = 200;
    const MAX_RETRIES = 20;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const cachedResult = await this.redis.get(RESULT_KEY);

      if (cachedResult) {
        return SuperJSON.parse<AuthResponseInDto>(cachedResult);
      }

      const acquired = await this.redis.set(
        LOCK_KEY,
        '1',
        'PX',
        LOCK_TTL_MS,
        'NX'
      );

      if (acquired === 'OK') {
        try {
          const result = await this.performRefresh(oldRefreshToken);
          await this.redis.set(
            RESULT_KEY,
            SuperJSON.stringify(result),
            'PX',
            RESULT_TTL_MS
          );
          return result;
        } finally {
          await this.redis.del(LOCK_KEY);
        }
      }

      await setTimeout(RETRY_DELAY_MS);
    }

    throw new UnauthorizedException('Failed to refresh');
  }

  private async performRefresh(
    oldRefreshToken: string
  ): Promise<AuthResponseInDto> {
    try {
      const [refreshToken, { userId, expiresAt: refreshTokenExpiresAt }] =
        await this.refreshTokenService.rotate(oldRefreshToken);
      const accessToken = await this.generateAccessToken(userId);
      const user = await this.userService.getOneById(userId);

      return {
        tokenType: 'Bearer',
        accessTokenExpiresAt: new Date(Date.now() + this.accessTokenExpiresIn),
        accessToken,
        refreshToken,
        refreshTokenExpiresAt,
        user,
      };
    } catch {
      throw new UnauthorizedException('Failed to refresh');
    }
  }

  async logout(refreshToken: string) {
    try {
      await this.refreshTokenService.revokeByToken(refreshToken);
    } catch {
      throw new UnauthorizedException('Failed to logout');
    }
  }

  async logoutEverywhere(refreshToken: string) {
    try {
      const { userId } =
        await this.refreshTokenService.revokeByToken(refreshToken);
      await this.refreshTokenService.revokeAllByUserId(userId);
    } catch {
      throw new UnauthorizedException('Failed to logout everywhere');
    }
  }
}
