import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { ApiNoContentResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { ZodResponse } from 'nestjs-zod';

import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ZodResponse({ type: AuthResponseDto, status: 200 })
  async login(@Body() data: LoginDto, @Req() req: Request) {
    return this.authService.login(data, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Public()
  @Post('sign-up')
  @ZodResponse({ type: AuthResponseDto, status: 200 })
  async signUp(@Body() data: SignUpDto, @Req() req: Request) {
    return this.authService.signUp(data, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Public()
  @Post('refresh')
  @ZodResponse({ type: AuthResponseDto, status: 200 })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Post('logout')
  @HttpCode(204)
  @ApiNoContentResponse()
  async logout(@Body('refreshToken') refreshToken: string): Promise<void> {
    await this.authService.logout(refreshToken);
  }

  @Post('logout-everywhere')
  @HttpCode(204)
  @ApiNoContentResponse()
  async logoutEverywhere(
    @Body('refreshToken') refreshToken: string
  ): Promise<void> {
    await this.authService.logoutEverywhere(refreshToken);
  }
}
