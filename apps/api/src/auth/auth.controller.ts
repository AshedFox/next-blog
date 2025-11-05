import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  SerializeOptions,
} from '@nestjs/common';
import type { Request } from 'express';

import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @SerializeOptions({ type: AuthResponseDto })
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() data: LoginDto,
    @Req() req: Request
  ): Promise<AuthResponseDto> {
    return this.authService.login(data, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Public()
  @SerializeOptions({ type: AuthResponseDto })
  @Post('sign-up')
  async signUp(
    @Body() data: SignUpDto,
    @Req() req: Request
  ): Promise<AuthResponseDto> {
    return this.authService.signUp(data, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Public()
  @SerializeOptions({ type: AuthResponseDto })
  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Body('refreshToken') refreshToken: string
  ): Promise<AuthResponseDto> {
    return this.authService.refresh(refreshToken);
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Body('refreshToken') refreshToken: string): Promise<void> {
    await this.authService.logout(refreshToken);
  }

  @Post('logout-everywhere')
  @HttpCode(204)
  async logoutEverywhere(
    @Body('refreshToken') refreshToken: string
  ): Promise<void> {
    await this.authService.logoutEverywhere(refreshToken);
  }
}
