import { Users } from '@prisma/client';

declare global {
  namespace Express {
    export interface Request {
      user?: Users;
      paramsDto?: unknown;
      bodyDto?: unknown;
    }
  }
}
