import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload, jwtTokenTypeEnum } from 'src/common/config/jwt.secrets';
import { JwtSubService } from 'src/core/jwt/jwt.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/types/auth.types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtSubService: JwtSubService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = await this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (isPublic) return true;

      const req = context.switchToHttp().getRequest();

      await this.getPayload(req, context);
      return true;
    } catch (error) {
      throw error;
    }
  }
  async getPayload(req: Request, ctx: ExecutionContext) {
    const auth = req.headers.authorization;

    if (!auth) throw new UnauthorizedException('Token not found !');

    if (!auth.startsWith('Bearer '))
      throw new UnauthorizedException(
        'Invalid toke type is missing Bearer token !',
      );

    try {
      const user: JwtPayload = await this.jwtSubService.verifyToken<JwtPayload>(
        auth.split(' ')[1],
        jwtTokenTypeEnum.ACCESS,
      );
      req['user'] = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token or expired token !');
    }
  }
}
