import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { CustomRequest } from '@/common/http/custom-request';
import { UserService } from '@/user/user.service';

import { TokenPayload } from '../auth.types';
import { OPTIONAL_AUTH_KEY } from '../decorators/optional-auth.decorator';
import { PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const isOptional = this.reflector.getAllAndOverride<boolean>(
      OPTIONAL_AUTH_KEY,
      [context.getHandler(), context.getClass()]
    );

    const request = context.switchToHttp().getRequest<CustomRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      if (isOptional) {
        return true;
      }
      throw new UnauthorizedException('No token provided!');
    }

    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token);

      if (!payload.sub) {
        throw new UnauthorizedException('No sub in token payload!');
      }

      const user = await this.userService.findOneById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found!');
      }

      request.user = user;
    } catch {
      if (isOptional) {
        return true;
      }
      throw new UnauthorizedException('Invalid or expired token!');
    }

    return true;
  }

  private extractTokenFromHeader(request: CustomRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
