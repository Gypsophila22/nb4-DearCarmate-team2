import type { Request, Response, NextFunction } from 'express';

export function mapCompanyKey(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (req.body && typeof req.body === 'object') {
    if ('companyName' in req.body && !('company' in req.body)) {
      req.body.company = req.body.companyName;
    }
  }
  next();
}
