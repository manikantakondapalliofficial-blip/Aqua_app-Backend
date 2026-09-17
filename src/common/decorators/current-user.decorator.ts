import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/// Use @CurrentUser() in a controller method to get the JWT payload.
/// Example: getMyTanks(@CurrentUser() user: { sub: string })
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
