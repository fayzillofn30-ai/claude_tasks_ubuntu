import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import {
  IS_PUBLIC_KEY,
  MODEL_NAME,
  ROLE_NAME,
  Models
} from 'src/common/types/auth.types';
import { UserRoles } from 'src/common/types/user.types';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Permission = (name: Models) => SetMetadata(MODEL_NAME, name);
export const UserRole = (...roles: UserRoles[]) =>
  SetMetadata(ROLE_NAME, roles);

export const UserData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request['user'];
  },
);
