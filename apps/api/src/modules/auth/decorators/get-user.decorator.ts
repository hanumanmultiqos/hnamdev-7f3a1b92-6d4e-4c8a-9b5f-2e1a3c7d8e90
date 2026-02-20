import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UserPayload } from '../../../common/interfaces/user-payload.interface';

/**
 * GetUser decorator extracts the current logged-in user from the request.
 * Usage: @GetUser() user: UserPayload
 */
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);