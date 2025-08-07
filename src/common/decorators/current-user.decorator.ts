import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserFromJwt } from '../types/user-from-jwt';

export const CurrentUser = createParamDecorator(
  // (data: keyof UserFromJwt, ctx: ExecutionContext) => {
  (data: keyof any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);