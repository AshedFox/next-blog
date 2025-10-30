import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

import { CustomRequest } from '@/common/http/custom-request';

import { MIN_ROLE_KEY } from '../decorators/min-role.decorator';
import { PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredMinRole = this.reflector.getAllAndOverride<UserRole>(
      MIN_ROLE_KEY,
      [context.getHandler(), context.getClass()]
    );

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredMinRole && !requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<CustomRequest>();

    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('User role not found');
    }

    const userRole = user.role;

    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(userRole)) {
        throw new ForbiddenException(
          `Required one of roles: ${requiredRoles.join(', ')}`
        );
      }
      return true;
    }

    if (requiredMinRole) {
      const ROLE_HIERARCHY: Record<UserRole, number> = {
        [UserRole.USER]: 1,
        [UserRole.ADMIN]: 9,
      };
      const userRoleLevel = ROLE_HIERARCHY[userRole];
      const requiredRoleLevel = ROLE_HIERARCHY[requiredMinRole];

      if (userRoleLevel < requiredRoleLevel) {
        throw new ForbiddenException(
          `Required minimum role: ${requiredMinRole}`
        );
      }
      return true;
    }

    return true;
  }
}
