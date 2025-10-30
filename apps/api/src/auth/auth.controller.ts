import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  SerializeOptions,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import ms, { StringValue } from 'ms';

import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  private refreshCookieName: string;
  private refreshCookieLifetime: number;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    this.refreshCookieName = this.configService.getOrThrow<string>(
      'REFRESH_TOKEN_COOKIE_NAME'
    );
    this.refreshCookieLifetime = ms(
      this.configService.getOrThrow<StringValue>('REFRESH_TOKEN_LIFETIME')
    );
  }

  @Public()
  @SerializeOptions({ type: AuthResponseDto })
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() data: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthResponseDto> {
    const { refreshToken, ...rest } = await this.authService.login(data, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.cookie(this.refreshCookieName, refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: this.refreshCookieLifetime,
    });

    return rest;
  }

  @Public()
  @SerializeOptions({ type: AuthResponseDto })
  @Post('sign-up')
  async signUp(
    @Body() data: SignUpDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthResponseDto> {
    const { refreshToken, ...rest } = await this.authService.signUp(data, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.cookie(this.refreshCookieName, refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: this.refreshCookieLifetime,
    });

    return rest;
  }

  @Public()
  @SerializeOptions({ type: AuthResponseDto })
  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthResponseDto> {
    const refreshToken = req.cookies[this.refreshCookieName] as string;

    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new UnauthorizedException('No refresh token!');
    }

    try {
      const { refreshToken: newRefreshToken, ...rest } =
        await this.authService.refresh(refreshToken);

      res.cookie(this.refreshCookieName, newRefreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: this.refreshCookieLifetime,
      });

      return rest;
    } catch (e) {
      res.cookie(this.refreshCookieName, '', {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 0,
      });
      throw e;
    }
  }

  @Post('logout')
  @HttpCode(204)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    const refreshToken = req.cookies[this.refreshCookieName] as string;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token!');
    }

    await this.authService.logout(refreshToken);

    res.cookie(this.refreshCookieName, '', {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });
  }

  @Post('logout-everywhere')
  @HttpCode(204)
  async logoutEverywhere(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    const refreshToken = req.cookies[this.refreshCookieName] as string;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token!');
    }

    await this.authService.logoutEverywhere(refreshToken);

    res.cookie(this.refreshCookieName, '', {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });
  }
}
