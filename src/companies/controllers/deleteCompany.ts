import type { Request, Response, NextFunction } from 'express';

async function deleteCompany(req: Request, res: Response, next: NextFunction) {
  try {
    // TODO: Prisma delete 로직 추가 예정
    return res.json({ message: 'deleteCompany not implemented yet' });
  } catch (err) {
    next(err);
  }
}

export default { deleteCompany };
