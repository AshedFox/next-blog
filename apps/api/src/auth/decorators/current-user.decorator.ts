import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { CustomRequest } from '@/common/http/custom-request';

export const CurrentUser = createParamDecorator(
  (data: keyof CustomRequest['user'] | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<CustomRequest>();

    if (!request.user || (data && !request.user[data])) {
      throw new UnauthorizedException('User not authorized');
    }

    return data ? request.user[data] : request.user;
  }
);
