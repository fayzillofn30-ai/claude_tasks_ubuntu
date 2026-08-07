import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as useragent from 'useragent';

@Injectable()
export class DeviceMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const agent = useragent.parse(req.headers['user-agent']);
    req['device'] = {
      ip: req.ip || req.connection.remoteAddress,
      agent: `${agent.family} ${agent.major}.${agent.minor}.${agent.patch}`,
    };
    next();
  }
}
