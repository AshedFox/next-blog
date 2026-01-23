import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { CustomRequest } from '@/common/http/custom-request';

export const CurrentUser = createParamDecorator(
  (data: keyof CustomRequest['user'] | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<CustomRequest>();

    if (!request.user || (data && !request.user[data])) {
      return undefined;
    }

    return data ? request.user[data] : request.user;
  }
);
